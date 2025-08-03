#!/usr/bin/env python3
"""
Simple API test script for NFT Smart Assistant
This script tests the basic functionality of the backend API
"""

import requests
import json
import time
import sys
from typing import Dict, Any

# Configuration
BASE_URL = "http://localhost:5000"
TEST_CONTRACT = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"  # Bored Ape Yacht Club
TEST_TOKEN_ID = "1"
TEST_BLOCKCHAIN = "ethereum"

def colored_print(message: str, color: str = "white") -> None:
    """Print colored messages to console"""
    colors = {
        "red": "\033[91m",
        "green": "\033[92m",
        "yellow": "\033[93m",
        "blue": "\033[94m",
        "purple": "\033[95m",
        "cyan": "\033[96m",
        "white": "\033[97m",
        "reset": "\033[0m"
    }
    print(f"{colors.get(color, colors['white'])}{message}{colors['reset']}")

def test_health_check() -> bool:
    """Test API health check endpoint"""
    colored_print("\n🔍 Testing health check...", "blue")
    try:
        response = requests.get(f"{BASE_URL}/api/health", timeout=10)
        if response.status_code == 200:
            data = response.json()
            colored_print(f"✅ Health check passed: {data.get('message', 'OK')}", "green")
            return True
        else:
            colored_print(f"❌ Health check failed: {response.status_code}", "red")
            return False
    except requests.exceptions.RequestException as e:
        colored_print(f"❌ Health check error: {str(e)}", "red")
        return False

def test_price_prediction() -> bool:
    """Test NFT price prediction endpoint"""
    colored_print("\n💰 Testing price prediction...", "blue")
    try:
        params = {
            "contract_address": TEST_CONTRACT,
            "token_id": TEST_TOKEN_ID,
            "blockchain": TEST_BLOCKCHAIN
        }
        response = requests.get(f"{BASE_URL}/api/nft/price-prediction", params=params, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            colored_print("✅ Price prediction successful:", "green")
            print(json.dumps(data, indent=2))
            return True
        else:
            colored_print(f"❌ Price prediction failed: {response.status_code}", "red")
            try:
                error_data = response.json()
                print(json.dumps(error_data, indent=2))
            except:
                print(response.text)
            return False
    except requests.exceptions.RequestException as e:
        colored_print(f"❌ Price prediction error: {str(e)}", "red")
        return False

def test_collection_analysis() -> bool:
    """Test collection analysis endpoint"""
    colored_print("\n📊 Testing collection analysis...", "blue")
    try:
        params = {
            "contract_address": TEST_CONTRACT,
            "blockchain": TEST_BLOCKCHAIN
        }
        response = requests.get(f"{BASE_URL}/api/nft/collection-analysis", params=params, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            colored_print("✅ Collection analysis successful:", "green")
            print(json.dumps(data, indent=2))
            return True
        else:
            colored_print(f"❌ Collection analysis failed: {response.status_code}", "red")
            try:
                error_data = response.json()
                print(json.dumps(error_data, indent=2))
            except:
                print(response.text)
            return False
    except requests.exceptions.RequestException as e:
        colored_print(f"❌ Collection analysis error: {str(e)}", "red")
        return False

def test_wash_trading_detection() -> bool:
    """Test wash trading detection endpoint"""
    colored_print("\n🔍 Testing wash trading detection...", "blue")
    try:
        params = {
            "contract_address": TEST_CONTRACT,
            "token_id": TEST_TOKEN_ID,
            "blockchain": TEST_BLOCKCHAIN
        }
        response = requests.get(f"{BASE_URL}/api/nft/wash-trading-detection", params=params, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            colored_print("✅ Wash trading detection successful:", "green")
            print(json.dumps(data, indent=2))
            return True
        else:
            colored_print(f"❌ Wash trading detection failed: {response.status_code}", "red")
            try:
                error_data = response.json()
                print(json.dumps(error_data, indent=2))
            except:
                print(response.text)
            return False
    except requests.exceptions.RequestException as e:
        colored_print(f"❌ Wash trading detection error: {str(e)}", "red")
        return False

def test_forgery_detection() -> bool:
    """Test forgery detection endpoint"""
    colored_print("\n🎨 Testing forgery detection...", "blue")
    try:
        params = {
            "contract_address": TEST_CONTRACT,
            "token_id": TEST_TOKEN_ID,
            "blockchain": TEST_BLOCKCHAIN
        }
        response = requests.get(f"{BASE_URL}/api/nft/forgery-detection", params=params, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            colored_print("✅ Forgery detection successful:", "green")
            print(json.dumps(data, indent=2))
            return True
        else:
            colored_print(f"❌ Forgery detection failed: {response.status_code}", "red")
            try:
                error_data = response.json()
                print(json.dumps(error_data, indent=2))
            except:
                print(response.text)
            return False
    except requests.exceptions.RequestException as e:
        colored_print(f"❌ Forgery detection error: {str(e)}", "red")
        return False

def main():
    """Run all API tests"""
    colored_print("🚀 NFT Smart Assistant API Test Suite", "cyan")
    colored_print("=" * 50, "cyan")
    
    # Wait for server to be ready
    colored_print("⏳ Waiting for server to be ready...", "yellow")
    time.sleep(2)
    
    tests = [
        ("Health Check", test_health_check),
        ("Price Prediction", test_price_prediction),
        ("Collection Analysis", test_collection_analysis),
        ("Wash Trading Detection", test_wash_trading_detection),
        ("Forgery Detection", test_forgery_detection)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            colored_print(f"❌ {test_name} crashed: {str(e)}", "red")
            results.append((test_name, False))
        
        # Small delay between tests
        time.sleep(1)
    
    # Print summary
    colored_print("\n📋 Test Results Summary", "cyan")
    colored_print("=" * 30, "cyan")
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        color = "green" if result else "red"
        colored_print(f"{test_name}: {status}", color)
        if result:
            passed += 1
    
    colored_print(f"\n📊 Overall: {passed}/{total} tests passed", "cyan")
    
    if passed == total:
        colored_print("🎉 All tests passed! API is working correctly.", "green")
        sys.exit(0)
    else:
        colored_print("⚠️  Some tests failed. Please check the API configuration.", "yellow")
        sys.exit(1)

if __name__ == "__main__":
    main()