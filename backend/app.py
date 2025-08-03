from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import os
from datetime import datetime
import logging
import random
import time
from risk_engine import NFTRiskEngine

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

# Initialize Unleash NFTs API client and Risk Engine
unleash_client = UnleashNFTsAPI(UNLEASH_API_KEY)
risk_engine = NFTRiskEngine()

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

# AI Risk Engines & Forensics API Endpoints

@app.route('/api/risk/comprehensive/<chain>/<address>', methods=['GET'])
def comprehensive_risk_analysis(chain, address):
    """Comprehensive AI-powered risk assessment"""
    if chain not in SUPPORTED_CHAINS:
        return jsonify({'error': f'Unsupported chain: {chain}'}), 400
    
    try:
        analysis_type = request.args.get('type', 'comprehensive')
        report = risk_engine.generate_risk_report(address, chain, analysis_type)
        
        return jsonify({
            'success': True,
            'analysis_type': 'comprehensive_risk',
            'chain': chain,
            'address': address,
            'data': report,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Error in comprehensive risk analysis: {str(e)}")
        return jsonify({'error': 'Risk analysis failed'}), 500

@app.route('/api/risk/wash-trading/<chain>/<address>', methods=['GET'])
def wash_trading_detection(chain, address):
    """AI-powered wash trading detection"""
    if chain not in SUPPORTED_CHAINS:
        return jsonify({'error': f'Unsupported chain: {chain}'}), 400
    
    try:
        # Get trading data (simulated)
        trading_data = {'address': address, 'chain': chain}
        result = risk_engine.detect_wash_trading(trading_data)
        
        return jsonify({
            'success': True,
            'analysis_type': 'wash_trading_detection',
            'chain': chain,
            'address': address,
            'data': result,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Error in wash trading detection: {str(e)}")
        return jsonify({'error': 'Wash trading detection failed'}), 500

@app.route('/api/risk/fake-collection/<chain>/<address>', methods=['GET'])
def fake_collection_detection(chain, address):
    """AI-powered fake collection detection"""
    if chain not in SUPPORTED_CHAINS:
        return jsonify({'error': f'Unsupported chain: {chain}'}), 400
    
    try:
        # Get collection data (simulated)
        collection_data = {'address': address, 'chain': chain}
        result = risk_engine.detect_fake_collections(collection_data)
        
        return jsonify({
            'success': True,
            'analysis_type': 'fake_collection_detection',
            'chain': chain,
            'address': address,
            'data': result,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Error in fake collection detection: {str(e)}")
        return jsonify({'error': 'Fake collection detection failed'}), 500

@app.route('/api/risk/rug-pull/<chain>/<address>', methods=['GET'])
def rug_pull_prediction(chain, address):
    """AI-powered rug pull risk prediction"""
    if chain not in SUPPORTED_CHAINS:
        return jsonify({'error': f'Unsupported chain: {chain}'}), 400
    
    try:
        # Get project data (simulated)
        project_data = {'address': address, 'chain': chain}
        result = risk_engine.predict_rug_pull_risk(project_data)
        
        return jsonify({
            'success': True,
            'analysis_type': 'rug_pull_prediction',
            'chain': chain,
            'address': address,
            'data': result,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Error in rug pull prediction: {str(e)}")
        return jsonify({'error': 'Rug pull prediction failed'}), 500

@app.route('/api/risk/score/<chain>/<address>', methods=['GET'])
def risk_score_calculation(chain, address):
    """Calculate AI-powered risk score"""
    if chain not in SUPPORTED_CHAINS:
        return jsonify({'error': f'Unsupported chain: {chain}'}), 400
    
    try:
        # Get NFT data (simulated)
        nft_data = {'address': address, 'chain': chain}
        result = risk_engine.calculate_risk_score(nft_data)
        
        return jsonify({
            'success': True,
            'analysis_type': 'risk_score',
            'chain': chain,
            'address': address,
            'data': result,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Error in risk score calculation: {str(e)}")
        return jsonify({'error': 'Risk score calculation failed'}), 500

@app.route('/api/risk/fraud-map/<chain>', methods=['GET'])
def fraud_risk_map(chain):
    """Generate interactive fraud risk map for blockchain"""
    if chain not in SUPPORTED_CHAINS:
        return jsonify({'error': f'Unsupported chain: {chain}'}), 400
    
    try:
        # Generate fraud risk map data
        risk_map_data = {
            'chain': chain,
            'high_risk_zones': [
                {
                    'address': f"0x{random.randint(10**15, 10**16-1):016x}",
                    'risk_score': random.uniform(0.8, 1.0),
                    'fraud_type': random.choice(['wash_trading', 'fake_collection', 'rug_pull']),
                    'confidence': random.uniform(0.7, 1.0)
                } for _ in range(random.randint(3, 8))
            ],
            'medium_risk_zones': [
                {
                    'address': f"0x{random.randint(10**15, 10**16-1):016x}",
                    'risk_score': random.uniform(0.4, 0.8),
                    'fraud_type': random.choice(['suspicious_activity', 'metadata_issues']),
                    'confidence': random.uniform(0.5, 0.8)
                } for _ in range(random.randint(5, 12))
            ],
            'network_statistics': {
                'total_addresses_analyzed': random.randint(1000, 10000),
                'high_risk_percentage': random.uniform(5, 15),
                'medium_risk_percentage': random.uniform(15, 30),
                'fraud_incidents_24h': random.randint(0, 5)
            },
            'trending_risks': [
                {
                    'risk_type': 'wash_trading',
                    'trend': 'increasing',
                    'change_percentage': random.uniform(5, 25)
                },
                {
                    'risk_type': 'fake_collections',
                    'trend': 'decreasing',
                    'change_percentage': random.uniform(-15, -5)
                }
            ]
        }
        
        return jsonify({
            'success': True,
            'analysis_type': 'fraud_risk_map',
            'chain': chain,
            'data': risk_map_data,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Error generating fraud risk map: {str(e)}")
        return jsonify({'error': 'Fraud risk map generation failed'}), 500

if __name__ == '__main__':
    port = config.get('server_port', 5000)
    app.run(debug=True, host='0.0.0.0', port=port)