# NFT Smart Assistant Bot

🤖 An AI-powered NFT analysis bot that provides intelligent insights using bitsCrunch API

## 🌟 Features

- **AI-Driven Price Prediction**: Leverages bitsCrunch's price estimation API for accurate NFT valuations
- **Multi-Chain Support**: Compatible with Ethereum, Polygon, and Binance Smart Chain
- **Wash Trading Detection**: Identifies suspicious trading patterns and market manipulation
- **Forgery Detection**: Detects fake and counterfeit NFTs using advanced AI algorithms
- **Real-time Analytics**: Provides up-to-date market data and trends
- **User-Friendly Interface**: Clean web interface and optional Telegram bot integration

## 🏗️ Architecture

```
nft-smart-assistant/
├── frontend/           # React-based web interface
├── backend/           # Python Flask API server
├── config/            # Configuration files
├── docs/              # Documentation
├── tests/             # Test files
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- bitsCrunch API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nft-smart-assistant
```

2. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Install frontend dependencies:
```bash
cd frontend
pnpm install
```

4. Configure API keys:
```bash
cp config/config.example.json config/config.json
# Edit config.json with your bitsCrunch API key
```

5. Run the application:
```bash
# Start backend
cd backend && python app.py

# Start frontend (in another terminal)
cd frontend && pnpm start
```

## 🔧 Configuration

Edit `config/config.json` to set up your API keys and preferences:

```json
{
  "bitscrunch_api_key": "your-api-key-here",
  "supported_chains": ["ethereum", "polygon", "bsc"],
  "server_port": 5000,
  "frontend_port": 3000
}
```

## 📖 API Documentation

### Endpoints

- `GET /api/nft/price/{contract_address}/{token_id}` - Get NFT price prediction
- `GET /api/nft/analysis/{contract_address}` - Get collection analysis
- `POST /api/nft/detect-wash-trading` - Detect wash trading patterns
- `POST /api/nft/detect-forgery` - Check for NFT forgeries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- [bitsCrunch API Documentation](https://docs.bitscrunch.com/docs)
- [Demo Video]()
- [Live Demo]()

## 👨‍💻 Author

**Chord** - [@chord244](https://github.com/chord233)
- Email: chord244@gmail.com
- Twitter: [@chord244](https://twitter.com/chord244)
- LinkedIn: [chord233](https://linkedin.com/in/chord233)

---

*Built for bitsCrunch x AI Builders Hack 2025* 🏆