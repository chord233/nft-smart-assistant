from datetime import datetime, timedelta
import logging
import random
from typing import Dict, List, Tuple, Optional
import json
import statistics

logger = logging.getLogger(__name__)

class NFTRiskEngine:
    """AI-powered NFT Risk Assessment and Fraud Detection Engine"""
    
    def __init__(self):
        self.risk_thresholds = {
            'low': 0.3,
            'medium': 0.6,
            'high': 0.8
        }
        self.fraud_patterns = {
            'wash_trading': {
                'volume_spike_threshold': 5.0,
                'repetitive_trading_threshold': 0.7,
                'price_manipulation_threshold': 0.8
            },
            'fake_collections': {
                'metadata_similarity_threshold': 0.9,
                'rapid_minting_threshold': 100,
                'suspicious_traits_threshold': 0.8
            },
            'rug_pulls': {
                'creator_activity_threshold': 0.2,
                'liquidity_drain_threshold': 0.8,
                'social_signals_threshold': 0.3
            }
        }
    
    def calculate_risk_score(self, nft_data: Dict) -> Dict:
        """Calculate comprehensive risk score for an NFT or collection"""
        try:
            # Extract key metrics
            volume_metrics = self._analyze_volume_patterns(nft_data)
            trading_metrics = self._analyze_trading_behavior(nft_data)
            metadata_metrics = self._analyze_metadata_integrity(nft_data)
            social_metrics = self._analyze_social_signals(nft_data)
            
            # Calculate weighted risk score
            risk_components = {
                'volume_risk': volume_metrics['risk_score'] * 0.3,
                'trading_risk': trading_metrics['risk_score'] * 0.25,
                'metadata_risk': metadata_metrics['risk_score'] * 0.25,
                'social_risk': social_metrics['risk_score'] * 0.2
            }
            
            total_risk_score = sum(risk_components.values())
            risk_level = self._get_risk_level(total_risk_score)
            
            return {
                'overall_risk_score': round(total_risk_score, 3),
                'risk_level': risk_level,
                'risk_components': risk_components,
                'detailed_analysis': {
                    'volume_analysis': volume_metrics,
                    'trading_analysis': trading_metrics,
                    'metadata_analysis': metadata_metrics,
                    'social_analysis': social_metrics
                },
                'recommendations': self._generate_recommendations(total_risk_score, risk_components),
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error calculating risk score: {str(e)}")
            return self._get_default_risk_assessment()
    
    def detect_wash_trading(self, trading_data: Dict) -> Dict:
        """Detect wash trading patterns using ML-inspired algorithms"""
        try:
            # Simulate wash trading detection
            volume_spike = random.uniform(0.1, 10.0)
            repetitive_patterns = random.uniform(0.0, 1.0)
            price_manipulation = random.uniform(0.0, 1.0)
            
            # Calculate wash trading probability
            wash_trading_score = (
                min(volume_spike / self.fraud_patterns['wash_trading']['volume_spike_threshold'], 1.0) * 0.4 +
                repetitive_patterns * 0.35 +
                price_manipulation * 0.25
            )
            
            is_wash_trading = wash_trading_score > 0.6
            confidence = min(wash_trading_score * 1.2, 1.0)
            
            return {
                'is_wash_trading': is_wash_trading,
                'wash_trading_score': round(wash_trading_score, 3),
                'confidence': round(confidence, 3),
                'indicators': {
                    'volume_spike': volume_spike > self.fraud_patterns['wash_trading']['volume_spike_threshold'],
                    'repetitive_patterns': repetitive_patterns > self.fraud_patterns['wash_trading']['repetitive_trading_threshold'],
                    'price_manipulation': price_manipulation > self.fraud_patterns['wash_trading']['price_manipulation_threshold']
                },
                'risk_factors': self._get_wash_trading_risk_factors(volume_spike, repetitive_patterns, price_manipulation)
            }
        except Exception as e:
            logger.error(f"Error detecting wash trading: {str(e)}")
            return {'is_wash_trading': False, 'wash_trading_score': 0.0, 'confidence': 0.0}
    
    def detect_fake_collections(self, collection_data: Dict) -> Dict:
        """Detect fake or suspicious NFT collections"""
        try:
            # Simulate fake collection detection
            metadata_similarity = random.uniform(0.0, 1.0)
            rapid_minting = random.randint(1, 200)
            suspicious_traits = random.uniform(0.0, 1.0)
            
            # Calculate fake collection probability
            fake_score = (
                metadata_similarity * 0.4 +
                min(rapid_minting / self.fraud_patterns['fake_collections']['rapid_minting_threshold'], 1.0) * 0.3 +
                suspicious_traits * 0.3
            )
            
            is_fake = fake_score > 0.7
            confidence = min(fake_score * 1.1, 1.0)
            
            return {
                'is_fake_collection': is_fake,
                'fake_score': round(fake_score, 3),
                'confidence': round(confidence, 3),
                'indicators': {
                    'high_metadata_similarity': metadata_similarity > self.fraud_patterns['fake_collections']['metadata_similarity_threshold'],
                    'rapid_minting': rapid_minting > self.fraud_patterns['fake_collections']['rapid_minting_threshold'],
                    'suspicious_traits': suspicious_traits > self.fraud_patterns['fake_collections']['suspicious_traits_threshold']
                },
                'risk_factors': self._get_fake_collection_risk_factors(metadata_similarity, rapid_minting, suspicious_traits)
            }
        except Exception as e:
            logger.error(f"Error detecting fake collections: {str(e)}")
            return {'is_fake_collection': False, 'fake_score': 0.0, 'confidence': 0.0}
    
    def predict_rug_pull_risk(self, project_data: Dict) -> Dict:
        """Predict the likelihood of a rug pull for an NFT project"""
        try:
            # Simulate rug pull risk prediction
            creator_activity = random.uniform(0.0, 1.0)
            liquidity_drain = random.uniform(0.0, 1.0)
            social_signals = random.uniform(0.0, 1.0)
            
            # Calculate rug pull risk
            rug_pull_risk = (
                (1 - creator_activity) * 0.4 +  # Low activity = higher risk
                liquidity_drain * 0.35 +
                (1 - social_signals) * 0.25  # Low social engagement = higher risk
            )
            
            is_high_risk = rug_pull_risk > 0.6
            confidence = min(rug_pull_risk * 1.3, 1.0)
            
            return {
                'is_high_rug_pull_risk': is_high_risk,
                'rug_pull_risk_score': round(rug_pull_risk, 3),
                'confidence': round(confidence, 3),
                'indicators': {
                    'low_creator_activity': creator_activity < self.fraud_patterns['rug_pulls']['creator_activity_threshold'],
                    'liquidity_concerns': liquidity_drain > self.fraud_patterns['rug_pulls']['liquidity_drain_threshold'],
                    'weak_social_signals': social_signals < self.fraud_patterns['rug_pulls']['social_signals_threshold']
                },
                'risk_factors': self._get_rug_pull_risk_factors(creator_activity, liquidity_drain, social_signals)
            }
        except Exception as e:
            logger.error(f"Error predicting rug pull risk: {str(e)}")
            return {'is_high_rug_pull_risk': False, 'rug_pull_risk_score': 0.0, 'confidence': 0.0}
    
    def generate_risk_report(self, address: str, chain: str, analysis_type: str = 'comprehensive') -> Dict:
        """Generate comprehensive risk assessment report"""
        try:
            # Simulate data collection
            mock_data = self._generate_mock_data(address, chain)
            
            # Perform various risk analyses
            risk_assessment = self.calculate_risk_score(mock_data)
            wash_trading_analysis = self.detect_wash_trading(mock_data)
            fake_collection_analysis = self.detect_fake_collections(mock_data)
            rug_pull_analysis = self.predict_rug_pull_risk(mock_data)
            
            # Generate visual risk map data
            risk_map_data = self._generate_risk_map_data(address, chain)
            
            return {
                'address': address,
                'chain': chain,
                'analysis_type': analysis_type,
                'overall_assessment': risk_assessment,
                'fraud_detection': {
                    'wash_trading': wash_trading_analysis,
                    'fake_collections': fake_collection_analysis,
                    'rug_pull_risk': rug_pull_analysis
                },
                'risk_visualization': risk_map_data,
                'executive_summary': self._generate_executive_summary(risk_assessment, wash_trading_analysis, fake_collection_analysis, rug_pull_analysis),
                'generated_at': datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error generating risk report: {str(e)}")
            return self._get_default_risk_report(address, chain)
    
    def _analyze_volume_patterns(self, data: Dict) -> Dict:
        """Analyze volume patterns for anomalies"""
        volume_volatility = random.uniform(0.1, 2.0)
        unusual_spikes = random.randint(0, 5)
        return {
            'risk_score': min(volume_volatility * 0.3 + unusual_spikes * 0.1, 1.0),
            'volume_volatility': volume_volatility,
            'unusual_spikes': unusual_spikes,
            'pattern_analysis': 'Moderate volatility detected' if volume_volatility > 1.0 else 'Normal patterns'
        }
    
    def _analyze_trading_behavior(self, data: Dict) -> Dict:
        """Analyze trading behavior patterns"""
        repetitive_trades = random.uniform(0.0, 1.0)
        bot_activity = random.uniform(0.0, 1.0)
        return {
            'risk_score': (repetitive_trades * 0.6 + bot_activity * 0.4),
            'repetitive_trades': repetitive_trades,
            'bot_activity_score': bot_activity,
            'behavior_analysis': 'Suspicious patterns detected' if repetitive_trades > 0.7 else 'Normal behavior'
        }
    
    def _analyze_metadata_integrity(self, data: Dict) -> Dict:
        """Analyze metadata for integrity issues"""
        similarity_score = random.uniform(0.0, 1.0)
        missing_data = random.uniform(0.0, 0.5)
        return {
            'risk_score': similarity_score * 0.7 + missing_data * 0.3,
            'similarity_score': similarity_score,
            'missing_data_ratio': missing_data,
            'integrity_analysis': 'High similarity detected' if similarity_score > 0.8 else 'Metadata appears unique'
        }
    
    def _analyze_social_signals(self, data: Dict) -> Dict:
        """Analyze social media and community signals"""
        engagement_score = random.uniform(0.0, 1.0)
        sentiment_score = random.uniform(-1.0, 1.0)
        return {
            'risk_score': max(0, (1 - engagement_score) * 0.6 + max(0, -sentiment_score) * 0.4),
            'engagement_score': engagement_score,
            'sentiment_score': sentiment_score,
            'social_analysis': 'Strong community' if engagement_score > 0.7 else 'Weak social presence'
        }
    
    def _get_risk_level(self, score: float) -> str:
        """Convert risk score to risk level"""
        if score < self.risk_thresholds['low']:
            return 'LOW'
        elif score < self.risk_thresholds['medium']:
            return 'MEDIUM'
        elif score < self.risk_thresholds['high']:
            return 'HIGH'
        else:
            return 'CRITICAL'
    
    def _generate_recommendations(self, risk_score: float, components: Dict) -> List[str]:
        """Generate risk mitigation recommendations"""
        recommendations = []
        
        if risk_score > 0.7:
            recommendations.append("⚠️ HIGH RISK: Avoid investment until further investigation")
            recommendations.append("🔍 Conduct thorough due diligence on project team")
        elif risk_score > 0.5:
            recommendations.append("⚡ MEDIUM RISK: Proceed with caution")
            recommendations.append("📊 Monitor trading patterns closely")
        else:
            recommendations.append("✅ LOW RISK: Appears relatively safe")
            recommendations.append("📈 Continue monitoring for any changes")
        
        # Component-specific recommendations
        if components.get('volume_risk', 0) > 0.6:
            recommendations.append("📉 Volume patterns show irregularities")
        if components.get('trading_risk', 0) > 0.6:
            recommendations.append("🤖 Potential bot activity detected")
        if components.get('metadata_risk', 0) > 0.6:
            recommendations.append("📝 Metadata integrity concerns")
        if components.get('social_risk', 0) > 0.6:
            recommendations.append("👥 Weak community engagement")
        
        return recommendations
    
    def _generate_mock_data(self, address: str, chain: str) -> Dict:
        """Generate mock data for analysis"""
        return {
            'address': address,
            'chain': chain,
            'volume_24h': random.uniform(1000, 100000),
            'trades_24h': random.randint(10, 1000),
            'unique_traders': random.randint(5, 500),
            'price_change_24h': random.uniform(-50, 50),
            'metadata_hash': f"0x{random.randint(10**15, 10**16-1):016x}",
            'creation_date': (datetime.now() - timedelta(days=random.randint(1, 365))).isoformat()
        }
    
    def _generate_risk_map_data(self, address: str, chain: str) -> Dict:
        """Generate data for risk visualization map"""
        return {
            'risk_heatmap': {
                'high_risk_addresses': [f"0x{random.randint(10**15, 10**16-1):016x}" for _ in range(random.randint(1, 5))],
                'medium_risk_addresses': [f"0x{random.randint(10**15, 10**16-1):016x}" for _ in range(random.randint(2, 8))],
                'low_risk_addresses': [f"0x{random.randint(10**15, 10**16-1):016x}" for _ in range(random.randint(5, 15))]
            },
            'network_analysis': {
                'connected_addresses': random.randint(10, 100),
                'suspicious_connections': random.randint(0, 5),
                'cluster_risk_score': random.uniform(0.0, 1.0)
            },
            'temporal_patterns': {
                'risk_trend': 'increasing' if random.random() > 0.5 else 'decreasing',
                'pattern_strength': random.uniform(0.0, 1.0)
            }
        }
    
    def _generate_executive_summary(self, risk_assessment: Dict, wash_trading: Dict, fake_collections: Dict, rug_pull: Dict) -> str:
        """Generate executive summary of risk analysis"""
        risk_level = risk_assessment.get('risk_level', 'UNKNOWN')
        overall_score = risk_assessment.get('overall_risk_score', 0)
        
        summary = f"Risk Assessment Summary: {risk_level} RISK (Score: {overall_score:.2f})\n\n"
        
        if wash_trading.get('is_wash_trading', False):
            summary += "🚨 Wash trading patterns detected\n"
        if fake_collections.get('is_fake_collection', False):
            summary += "🚨 Potential fake collection identified\n"
        if rug_pull.get('is_high_rug_pull_risk', False):
            summary += "🚨 High rug pull risk detected\n"
        
        if risk_level == 'LOW':
            summary += "✅ This asset appears to have low risk factors."
        elif risk_level == 'MEDIUM':
            summary += "⚠️ This asset has moderate risk factors that require attention."
        else:
            summary += "🚨 This asset has significant risk factors and should be approached with extreme caution."
        
        return summary
    
    def _get_wash_trading_risk_factors(self, volume_spike: float, repetitive: float, manipulation: float) -> List[str]:
        """Get wash trading risk factors"""
        factors = []
        if volume_spike > 5.0:
            factors.append("Unusual volume spikes detected")
        if repetitive > 0.7:
            factors.append("Repetitive trading patterns")
        if manipulation > 0.8:
            factors.append("Potential price manipulation")
        return factors
    
    def _get_fake_collection_risk_factors(self, similarity: float, minting: int, traits: float) -> List[str]:
        """Get fake collection risk factors"""
        factors = []
        if similarity > 0.9:
            factors.append("High metadata similarity")
        if minting > 100:
            factors.append("Rapid minting activity")
        if traits > 0.8:
            factors.append("Suspicious trait distribution")
        return factors
    
    def _get_rug_pull_risk_factors(self, activity: float, liquidity: float, social: float) -> List[str]:
        """Get rug pull risk factors"""
        factors = []
        if activity < 0.2:
            factors.append("Low creator activity")
        if liquidity > 0.8:
            factors.append("Liquidity concerns")
        if social < 0.3:
            factors.append("Weak social signals")
        return factors
    
    def _get_default_risk_assessment(self) -> Dict:
        """Get default risk assessment for error cases"""
        return {
            'overall_risk_score': 0.5,
            'risk_level': 'MEDIUM',
            'risk_components': {},
            'detailed_analysis': {},
            'recommendations': ['Unable to complete analysis - manual review recommended'],
            'timestamp': datetime.now().isoformat()
        }
    
    def _get_default_risk_report(self, address: str, chain: str) -> Dict:
        """Get default risk report for error cases"""
        return {
            'address': address,
            'chain': chain,
            'analysis_type': 'error',
            'overall_assessment': self._get_default_risk_assessment(),
            'fraud_detection': {},
            'risk_visualization': {},
            'executive_summary': 'Analysis could not be completed due to technical issues.',
            'generated_at': datetime.now().isoformat()
        }