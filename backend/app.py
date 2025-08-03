from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import os
from datetime import datetime
import logging
import random
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Load configuration
config_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'config', 'config.json')
with open(config_path, 'r') as f:
    config = json.load(f)

UNLEASH_API_KEY = config.get('bitscrunch_api_key')  # Reusing the same config key
UNLEASH_BASE_URL = 'https://api.unleashnfts.com/api/v1'
# Chain name to ID mapping for Unleash NFTs API
CHAIN_ID_MAP = {
    'ethereum': 1,
    'polygon': 137,
    'bsc': 57,  # Binance Smart Chain
    'avalanche': 43114,
    'linea': 59144,
    'solana': 900
}
SUPPORTED_CHAINS = ['ethereum', 'polygon', 'bsc', 'avalanche', 'linea', 'solana']

class UnleashNFTsAPI:
    def __init__(self, api_key):
        self.api_key = api_key
        self.headers = {
            'x-api-key': api_key,
            'accept': 'application/json'
        }
    
    def get_market_metrics(self, chain='ethereum', metrics='volume', time_range='24h', currency='usd'):
        """Get market metrics for a blockchain"""
        try:
            chain_id = CHAIN_ID_MAP.get(chain, 1)
            url = f'{UNLEASH_BASE_URL}/market/metrics'
            params = {
                'currency': currency,
                'blockchain': chain_id,
                'metrics': metrics,
                'time_range': time_range,
                'include_washtrade': 'true'
            }
            response = requests.get(url, headers=self.headers, params=params)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error getting market metrics: {str(e)}")
            return None
    
    def get_blockchains(self, sort_by='blockchain_name', offset=0, limit=30):
        """Get list of supported blockchains"""
        try:
            url = f'{UNLEASH_BASE_URL}/blockchains'
            params = {
                'sort_by': sort_by,
                'offset': offset,
                'limit': limit
            }
            response = requests.get(url, headers=self.headers, params=params)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error getting blockchains: {str(e)}")
            return None
    
    def get_multiple_metrics(self, chain='ethereum', metrics_list=['volume', 'sales'], time_range='24h', currency='usd'):
        """Get multiple market metrics for a blockchain by making separate calls"""
        try:
            results = {}
            for metric in metrics_list:
                result = self.get_market_metrics(chain, metric, time_range, currency)
                if result:
                    results[metric] = result
            return {'metric_values': results} if results else None
        except Exception as e:
            logger.error(f"Error getting multiple metrics: {str(e)}")
            return None
    
    def get_washtrade_metrics(self, chain='ethereum', time_range='24h', currency='usd'):
        """Get wash trade volume metrics for a blockchain"""
        try:
            chain_id = CHAIN_ID_MAP.get(chain, 1)
            url = f'{UNLEASH_BASE_URL}/market/metrics'
            params = {
                'currency': currency,
                'blockchain': chain_id,
                'metrics': 'washtrade_volume',
                'time_range': time_range,
                'include_washtrade': 'true'
            }
            response = requests.get(url, headers=self.headers, params=params)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error getting washtrade metrics: {str(e)}")
            return None

# Initialize Unleash NFTs API client
unleash_client = UnleashNFTsAPI(UNLEASH_API_KEY)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'supported_chains': SUPPORTED_CHAINS
    })

@app.route('/api/market/metrics/<chain>', methods=['GET'])
def get_market_metrics(chain):
    """Get market metrics for a blockchain"""
    if chain not in SUPPORTED_CHAINS:
        return jsonify({'error': f'Unsupported chain: {chain}'}), 400
    
    metrics = request.args.get('metrics', 'volume')
    time_range = request.args.get('time_range', '24h')
    currency = request.args.get('currency', 'usd')
    
    result = unleash_client.get_market_metrics(chain, metrics, time_range, currency)
    
    if result is None:
        return jsonify({'error': 'Failed to get market metrics'}), 500
    
    return jsonify({
        'chain': chain,
        'metrics': metrics,
        'time_range': time_range,
        'currency': currency,
        'data': result,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/blockchains', methods=['GET'])
def get_blockchains():
    """Get list of supported blockchains"""
    sort_by = request.args.get('sort_by', 'blockchain_name')
    offset = int(request.args.get('offset', 0))
    limit = int(request.args.get('limit', 30))
    
    result = unleash_client.get_blockchains(sort_by, offset, limit)
    
    if result is None:
        return jsonify({'error': 'Failed to get blockchains'}), 500
    
    return jsonify({
        'sort_by': sort_by,
        'offset': offset,
        'limit': limit,
        'data': result,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/market/multiple-metrics/<chain>', methods=['GET'])
def get_multiple_metrics(chain):
    """Get multiple market metrics for a blockchain"""
    if chain not in SUPPORTED_CHAINS:
        return jsonify({'error': f'Unsupported chain: {chain}'}), 400
    
    # Get metrics from query parameters, default to volume and sales
    metrics_param = request.args.get('metrics', 'volume,sales')
    metrics_list = [m.strip() for m in metrics_param.split(',')]
    time_range = request.args.get('time_range', '24h')
    currency = request.args.get('currency', 'usd')
    
    result = unleash_client.get_multiple_metrics(chain, metrics_list, time_range, currency)
    
    if result is None:
        return jsonify({'error': 'Failed to get multiple metrics'}), 500
    
    return jsonify({
        'chain': chain,
        'metrics': metrics_list,
        'time_range': time_range,
        'currency': currency,
        'data': result,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/market/washtrade/<chain>', methods=['GET'])
def get_washtrade_metrics(chain):
    """Get wash trade volume metrics for a blockchain"""
    if chain not in SUPPORTED_CHAINS:
        return jsonify({'error': f'Unsupported chain: {chain}'}), 400
    
    time_range = request.args.get('time_range', '24h')
    currency = request.args.get('currency', 'usd')
    
    result = unleash_client.get_washtrade_metrics(chain, time_range, currency)
    
    if result is None:
        return jsonify({'error': 'Failed to get washtrade metrics'}), 500
    
    return jsonify({
        'chain': chain,
        'metric': 'washtrade_volume',
        'time_range': time_range,
        'currency': currency,
        'data': result,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/chains', methods=['GET'])
def get_supported_chains():
    """Get list of supported blockchain networks"""
    return jsonify({
        'supported_chains': SUPPORTED_CHAINS,
        'default_chain': 'ethereum'
    })

if __name__ == '__main__':
    port = config.get('server_port', 5000)
    app.run(debug=True, host='0.0.0.0', port=port)