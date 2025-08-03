import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Paper,
  Avatar,
  IconButton,
  Fade,
  Slide,
  Zoom
} from '@mui/material';
import {
  TrendingUp,
  Security,
  Analytics,
  Warning,
  CheckCircle,
  Error,
  AutoAwesome,
  Rocket,
  Shield,
  Speed,
  GitHub,
  Twitter,
  LinkedIn
} from '@mui/icons-material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [contractAddress, setContractAddress] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [selectedChain, setSelectedChain] = useState('ethereum');
  const [supportedChains, setSupportedChains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('price');

  useEffect(() => {
    fetchSupportedChains();
  }, []);

  const fetchSupportedChains = async () => {
    try {
      const response = await axios.get('/api/health');
      setSupportedChains(response.data.supported_chains);
    } catch (error) {
      console.error('Error fetching supported chains:', error);
      toast.error('Failed to load supported chains');
    }
  };

  const handlePriceAnalysis = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/market/metrics/${selectedChain}?metrics=volume&time_range=24h&currency=usd`
      );
      setResults({ type: 'price', data: response.data });
      toast.success('Market metrics analysis completed!');
    } catch (error) {
      console.error('Error getting market metrics:', error);
      toast.error('Failed to get market metrics');
    } finally {
      setLoading(false);
    }
  };

  const handleCollectionAnalysis = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/blockchains');
      setResults({ type: 'collection', data: response.data });
      toast.success('Blockchain analysis completed!');
    } catch (error) {
      console.error('Error getting blockchain analysis:', error);
      toast.error('Failed to get blockchain analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleWashTradingDetection = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/market/multiple-metrics/${selectedChain}?metrics=volume&metrics=sales&time_range=24h&currency=usd`
      );
      setResults({ type: 'wash-trading', data: response.data });
      toast.success('Multiple metrics analysis completed!');
    } catch (error) {
      console.error('Error getting multiple metrics:', error);
      toast.error('Failed to get multiple metrics');
    } finally {
      setLoading(false);
    }
  };

  const handleForgeryDetection = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/market/washtrade/${selectedChain}?time_range=24h&currency=usd`
      );
      setResults({ type: 'forgery', data: response.data });
      toast.success('Washtrade metrics analysis completed!');
    } catch (error) {
      console.error('Error getting washtrade metrics:', error);
      toast.error('Failed to get washtrade metrics');
    } finally {
      setLoading(false);
    }
  };

  const renderResults = () => {
    if (!results) return null;

    const { type, data } = results;

    return (
      <Fade in={true} timeout={800}>
        <Box sx={{ mt: 6 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h4" 
              className="gradient-text"
              sx={{ 
                fontWeight: 700,
                mb: 2
              }}
            >
              Analysis Results
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Powered by AI Intelligence
            </Typography>
          </Box>
          
          <Zoom in={true} timeout={1000}>
            <Card className="glass-card result-card">
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar 
                    sx={{ 
                      background: 'linear-gradient(45deg, #00d4ff, #0099cc)',
                      mr: 2,
                      width: 48,
                      height: 48
                    }}
                  >
                    <AutoAwesome />
                  </Avatar>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 600, 
                      color: 'white',
                      textTransform: 'capitalize'
                    }}
                  >
                    {type}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={`Chain: ${selectedChain}`} 
                    color="primary" 
                    size="small" 
                    sx={{ mr: 1 }}
                  />
                  <Chip 
                    label={`Type: ${type}`} 
                    color="secondary" 
                    size="small"
                  />
                </Box>
                
                <Box 
                  className="json-viewer"
                  sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                    fontSize: '14px',
                    lineHeight: 1.6,
                    color: '#e0e0e0',
                    overflow: 'auto',
                    maxHeight: '500px',
                    '&::-webkit-scrollbar': {
                      width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'linear-gradient(45deg, #00d4ff, #0099cc)',
                      borderRadius: '4px',
                    },
                  }}
                >
                  <pre style={{ 
                    margin: 0,
                    whiteSpace: 'pre-wrap', 
                    wordWrap: 'break-word'
                  }}>
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </Box>
              </CardContent>
            </Card>
          </Zoom>
        </Box>
      </Fade>
    );
  };

  return (
    <Box className="app-container">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hero Section */}
        <Fade in={true} timeout={1000}>
          <Box className="hero-section">
            <Zoom in={true} timeout={1200}>
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  margin: '0 auto 24px',
                  background: 'linear-gradient(45deg, #00d4ff, #ff6b35)',
                  fontSize: '2rem'
                }}
              >
                🤖
              </Avatar>
            </Zoom>
            <Typography 
              variant="h2" 
              component="h1" 
              className="gradient-text"
              sx={{ 
                fontWeight: 800, 
                mb: 2,
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              NFT Smart Assistant
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                mb: 4,
                fontWeight: 300
              }}
            >
              AI-Powered NFT Analysis using bitsCrunch API
            </Typography>
            
            {/* Feature highlights */}
            <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
              <Grid item>
                <Chip 
                  icon={<AutoAwesome />} 
                  label="AI-Powered" 
                  className="feature-chip"
                />
              </Grid>
              <Grid item>
                <Chip 
                  icon={<Shield />} 
                  label="Secure Analysis" 
                  className="feature-chip"
                />
              </Grid>
              <Grid item>
                <Chip 
                  icon={<Speed />} 
                  label="Real-time Data" 
                  className="feature-chip"
                />
              </Grid>
            </Grid>
          </Box>
        </Fade>

        {/* Main Content */}
        <Slide direction="up" in={true} timeout={800}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card className="glass-card" sx={{ height: '100%', minHeight: '500px' }}>
                <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar 
                      sx={{ 
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        mr: 2
                      }}
                    >
                      <Analytics />
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: 'white' }}>
                      NFT Information
                    </Typography>
                  </Box>
                  
                  <TextField
                    fullWidth
                    label="Contract Address"
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                    margin="normal"
                    placeholder="0x..."
                    className="modern-input"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(0, 212, 255, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00d4ff',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                      '& .MuiOutlinedInput-input': {
                        color: 'white',
                      },
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Token ID"
                    value={tokenId}
                    onChange={(e) => setTokenId(e.target.value)}
                    margin="normal"
                    placeholder="1234"
                    className="modern-input"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(0, 212, 255, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00d4ff',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                      '& .MuiOutlinedInput-input': {
                        color: 'white',
                      },
                    }}
                  />
                  
                  <FormControl fullWidth margin="normal">
                    <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Blockchain</InputLabel>
                    <Select
                      value={selectedChain}
                      onChange={(e) => setSelectedChain(e.target.value)}
                      label="Blockchain"
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(0, 212, 255, 0.5)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#00d4ff',
                        },
                        '& .MuiSvgIcon-root': {
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                      }}
                    >
                      {supportedChains.map((chain) => (
                        <MenuItem key={chain} value={chain}>
                          {chain.charAt(0).toUpperCase() + chain.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card className="glass-card" sx={{ height: '100%', minHeight: '500px' }}>
                <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar 
                      sx={{ 
                        background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
                        mr: 2
                      }}
                    >
                      <Rocket />
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: 'white' }}>
                      Analysis Tools
                    </Typography>
                  </Box>
                  
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<TrendingUp />}
                          onClick={handlePriceAnalysis}
                          disabled={loading}
                          className="cta-button"
                          sx={{ 
                            mb: 2,
                            height: '56px',
                            fontSize: '1rem',
                            fontWeight: 600
                          }}
                        >
                          Price Prediction
                        </Button>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<Analytics />}
                          onClick={handleCollectionAnalysis}
                          disabled={loading}
                          className="cta-button"
                          sx={{ 
                            mb: 2,
                            height: '56px',
                            fontSize: '1rem',
                            fontWeight: 600
                          }}
                        >
                          Collection Analysis
                        </Button>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<Warning />}
                          onClick={handleWashTradingDetection}
                          disabled={loading}
                          className="cta-button"
                          sx={{ 
                            mb: 2,
                            height: '56px',
                            fontSize: '1rem',
                            fontWeight: 600
                          }}
                        >
                          Wash Trading Detection
                        </Button>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<Security />}
                          onClick={handleForgeryDetection}
                          disabled={loading}
                          className="cta-button"
                          sx={{ 
                            height: '56px',
                            fontSize: '1rem',
                            fontWeight: 600
                          }}
                        >
                          Forgery Detection
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                  
                  {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                      <CircularProgress 
                        sx={{ 
                          color: '#00d4ff',
                          '& .MuiCircularProgress-circle': {
                            strokeLinecap: 'round',
                          },
                        }}
                        size={48}
                        thickness={4}
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Slide>

      {renderResults()}

      <Box 
        sx={{ 
          mt: 8, 
          py: 6, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Box sx={{ mb: 3 }}>
          <IconButton 
            sx={{ 
              mx: 1,
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #00d4ff, #0099cc)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <GitHub />
          </IconButton>
          <IconButton 
            sx={{ 
              mx: 1,
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #1da1f2, #0d8bd9)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <Twitter />
          </IconButton>
          <IconButton 
            sx={{ 
              mx: 1,
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #0077b5, #005885)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <LinkedIn />
          </IconButton>
        </Box>
        
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'white',
            fontWeight: 600,
            mb: 1
          }}
        >
          NFT Smart Assistant
        </Typography>
        
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            mb: 2
          }}
        >
          Empowering NFT Analysis with AI Technology
        </Typography>
        
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
          Built with ❤️ for bitsCrunch x AI Builders Hack 2025
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
          By <strong>Chord</strong> - 
          <a href="https://github.com/chord233" target="_blank" rel="noopener noreferrer" style={{ color: '#00d4ff' }}>
            @chord233
          </a>
        </Typography>
        
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.5)'
          }}
        >
          © 2024 NFT Smart Assistant. All rights reserved.
        </Typography>
      </Box>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Container>
    </Box>
  );
}

export default App;