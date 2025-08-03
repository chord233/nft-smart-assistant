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
  Zoom,
  Tab,
  Tabs
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
  LinkedIn,
  Gavel,
  VisibilityOff,
  BugReport,
  Assessment,
  Map,
  Timeline,
  PieChart,
  BarChart,
  Dangerous
} from '@mui/icons-material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [contractAddress, setContractAddress] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [selectedChain, setSelectedChain] = useState('ethereum');
  const [supportedChains, setSupportedChains] = useState(['ethereum', 'polygon', 'bsc', 'avalanche', 'linea', 'solana']);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('risk');
  const [showRawData, setShowRawData] = useState(false);

  useEffect(() => {
    fetchSupportedChains();
  }, []);

  const fetchSupportedChains = async () => {
    try {
      const response = await axios.get('/api/health');
      if (response.data.supported_chains && response.data.supported_chains.length > 0) {
        setSupportedChains(response.data.supported_chains);
      }
    } catch (error) {
      console.error('Error fetching supported chains:', error);
      // Keep default supported chains if API fails
    }
  };

  const handleRiskAnalysis = async () => {
    if (!contractAddress) {
      toast.error('Please enter a contract address');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/risk/comprehensive/${selectedChain}/${contractAddress}`
      );
      setResults({ type: 'comprehensive_risk', data: response.data.data });
      toast.success('🔍 Comprehensive risk analysis completed!');
    } catch (error) {
      console.error('Error getting risk analysis:', error);
      toast.error('Failed to complete risk analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleFakeCollectionDetection = async () => {
    if (!contractAddress) {
      toast.error('Please enter a contract address');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/risk/fake-collection/${selectedChain}/${contractAddress}`
      );
      setResults({ type: 'fake_collection_detection', data: response.data.data });
      toast.success('🕵️ Fake collection detection completed!');
    } catch (error) {
      console.error('Error detecting fake collections:', error);
      toast.error('Failed to detect fake collections');
    } finally {
      setLoading(false);
    }
  };

  const handleWashTradingDetection = async () => {
    if (!contractAddress) {
      toast.error('Please enter a contract address');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/risk/wash-trading/${selectedChain}/${contractAddress}`
      );
      setResults({ type: 'wash_trading_detection', data: response.data.data });
      toast.success('🚨 Wash trading detection completed!');
    } catch (error) {
      console.error('Error detecting wash trading:', error);
      toast.error('Failed to detect wash trading');
    } finally {
      setLoading(false);
    }
  };

  const handleRugPullPrediction = async () => {
    if (!contractAddress) {
      toast.error('Please enter a contract address');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/risk/rug-pull/${selectedChain}/${contractAddress}`
      );
      setResults({ type: 'rug_pull_prediction', data: response.data.data });
      toast.success('⚠️ Rug pull risk prediction completed!');
    } catch (error) {
      console.error('Error predicting rug pull risk:', error);
      toast.error('Failed to predict rug pull risk');
    } finally {
      setLoading(false);
    }
  };

  const handleFraudMapGeneration = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/risk/fraud-map/${selectedChain}`
      );
      setResults({ type: 'fraud_risk_map', data: response.data.data });
      toast.success('🗺️ Fraud risk map generated!');
    } catch (error) {
      console.error('Error generating fraud map:', error);
      toast.error('Failed to generate fraud map');
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
                
                {/* Risk Score Display */}
                {(data && Object.keys(data).length > 0) && (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ color: 'white', mb: 2, display: 'flex', alignItems: 'center' }}>
                      <Assessment sx={{ mr: 1 }} />
                      Risk Score
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ flexGrow: 1, mr: 2 }}>
                        <Box sx={{ 
                          height: 20, 
                          backgroundColor: 'rgba(255,255,255,0.1)', 
                          borderRadius: 10,
                          overflow: 'hidden'
                        }}>
                          <Box sx={{
                            height: '100%',
                            width: `${(data?.overall_assessment?.overall_risk_score || data?.overall_risk_score || data?.risk_score || 0) * 100}%`,
                            background: (data?.overall_assessment?.overall_risk_score || data?.overall_risk_score || data?.risk_score || 0) > 0.7 ? 'linear-gradient(45deg, #ff4444, #cc0000)' : 
                                       (data?.overall_assessment?.overall_risk_score || data?.overall_risk_score || data?.risk_score || 0) > 0.4 ? 'linear-gradient(45deg, #ffaa00, #ff8800)' : 
                                       'linear-gradient(45deg, #00ff88, #00cc66)',
                            borderRadius: 10
                          }} />
                        </Box>
                      </Box>
                      <Typography variant="h5" sx={{ 
                        color: (data?.overall_assessment?.overall_risk_score || data?.overall_risk_score || data?.risk_score || 0) > 0.7 ? '#ff4444' : 
                               (data?.overall_assessment?.overall_risk_score || data?.overall_risk_score || data?.risk_score || 0) > 0.4 ? '#ffaa00' : '#00ff88',
                        fontWeight: 'bold',
                        minWidth: '60px'
                      }}>
                        {Math.round((data?.overall_assessment?.overall_risk_score || data?.overall_risk_score || data?.risk_score || 0) * 100)}%
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {(data?.overall_assessment?.overall_risk_score || data?.overall_risk_score || data?.risk_score || 0) > 0.7 ? 'High Risk - Invest with Caution' : 
                       (data?.overall_assessment?.overall_risk_score || data?.overall_risk_score || data?.risk_score || 0) > 0.4 ? 'Medium Risk - Further Analysis Required' : 'Low Risk - Relatively Safe'}
                    </Typography>
                  </Box>
                )}

                {/* Key Metrics Grid - Always show if data exists */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {(data && Object.keys(data).length > 0) && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Card sx={{ 
                        background: 'rgba(255,255,255,0.05)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 2
                      }}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <Warning sx={{ 
                            fontSize: 40, 
                            color: (data?.trading_analysis?.risk_score > 0.5 || data?.is_wash_trading || data?.wash_trading_detected) ? '#ff4444' : '#00ff88',
                            mb: 1 
                          }} />
                          <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                            Wash Trading
                          </Typography>
                          <Typography variant="body1" sx={{ 
                            color: (data?.trading_analysis?.risk_score > 0.5 || data?.is_wash_trading || data?.wash_trading_detected) ? '#ff4444' : '#00ff88',
                            fontWeight: 'bold'
                          }}>
                            {(data?.trading_analysis?.risk_score > 0.5 || data?.is_wash_trading || data?.wash_trading_detected) ? 'Detected' : 'Not Detected'}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                  
                  {(data && Object.keys(data).length > 0) && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Card sx={{ 
                        background: 'rgba(255,255,255,0.05)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 2
                      }}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <VisibilityOff sx={{ 
                            fontSize: 40, 
                            color: (data?.metadata_analysis?.risk_score || data?.fake_score || data?.fake_collection_probability || 0) > 0.5 ? '#ff4444' : '#00ff88',
                            mb: 1 
                          }} />
                          <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                            Fake Collection Probability
                          </Typography>
                          <Typography variant="body1" sx={{ 
                            color: (data?.metadata_analysis?.risk_score || data?.fake_score || data?.fake_collection_probability || 0) > 0.5 ? '#ff4444' : '#00ff88',
                            fontWeight: 'bold'
                          }}>
                            {((data?.metadata_analysis?.risk_score || data?.fake_score || data?.fake_collection_probability || 0) * 100).toFixed(1)}%
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                  
                  {(data && Object.keys(data).length > 0) && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Card sx={{ 
                        background: 'rgba(255,255,255,0.05)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 2
                      }}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <Dangerous sx={{ 
                            fontSize: 40, 
                            color: (data?.social_analysis?.risk_score > 0.7 || data?.overall_assessment?.overall_risk_score > 0.7 || data?.risk_score > 0.7 || data?.rugpull_risk === 'high') ? '#ff4444' : 
                                   (data?.social_analysis?.risk_score > 0.4 || data?.overall_assessment?.overall_risk_score > 0.4 || data?.risk_score > 0.4 || data?.rugpull_risk === 'medium') ? '#ffaa00' : '#00ff88',
                            mb: 1 
                          }} />
                          <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                            Rug Pull Risk
                          </Typography>
                          <Typography variant="body1" sx={{ 
                            color: (data?.social_analysis?.risk_score > 0.7 || data?.overall_assessment?.overall_risk_score > 0.7 || data?.risk_score > 0.7 || data?.rugpull_risk === 'high') ? '#ff4444' :
                                   (data?.social_analysis?.risk_score > 0.4 || data?.overall_assessment?.overall_risk_score > 0.4 || data?.risk_score > 0.4 || data?.rugpull_risk === 'medium') ? '#ffaa00' : '#00ff88',
                            fontWeight: 'bold'
                          }}>
                            {(data?.social_analysis?.risk_score > 0.7 || data?.overall_assessment?.overall_risk_score > 0.7 || data?.risk_score > 0.7 || data?.rugpull_risk === 'high') ? 'High' :
                             (data?.social_analysis?.risk_score > 0.4 || data?.overall_assessment?.overall_risk_score > 0.4 || data?.risk_score > 0.4 || data?.rugpull_risk === 'medium') ? 'Medium' : 'Low'}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </Grid>



                {/* Detailed Analysis */}
                {(data && Object.keys(data).length > 0) && (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ color: 'white', mb: 2, display: 'flex', alignItems: 'center' }}>
                      <Analytics sx={{ mr: 1 }} />
                      Detailed Analysis
                    </Typography>
                    <Card sx={{ 
                      background: 'rgba(255,255,255,0.05)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 2
                    }}>
                      <CardContent>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.6 }}>
                          {data?.executive_summary || data?.analysis || 
                           (data?.risk_factors && data?.risk_factors.length > 0 ? 
                            data?.risk_factors.join(', ') : 
                            'No detailed analysis information available')}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                )}

                {/* Recommendations */}
                {(data?.overall_assessment?.recommendations || data?.recommendations) && (data?.overall_assessment?.recommendations || data?.recommendations).length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ color: 'white', mb: 2, display: 'flex', alignItems: 'center' }}>
                      <CheckCircle sx={{ mr: 1 }} />
                      Recommendations
                    </Typography>
                    {(data?.overall_assessment?.recommendations || data?.recommendations || []).map((rec, index) => (
                      <Alert 
                        key={index}
                        severity="info" 
                        sx={{ 
                          mb: 1, 
                          backgroundColor: 'rgba(33, 150, 243, 0.1)',
                          color: 'white',
                          '& .MuiAlert-icon': { color: '#2196f3' }
                        }}
                      >
                        {rec}
                      </Alert>
                    ))}
                  </Box>
                )}

                {/* Raw Data Toggle */}
                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    variant="outlined"
                    onClick={() => setShowRawData(!showRawData)}
                    sx={{ 
                      color: 'rgba(255,255,255,0.7)',
                      borderColor: 'rgba(255,255,255,0.3)',
                      '&:hover': {
                        borderColor: 'rgba(255,255,255,0.5)',
                        backgroundColor: 'rgba(255,255,255,0.05)'
                      }
                    }}
                  >
                    {showRawData ? 'Hide Raw Data' : 'Show Raw Data'}
                  </Button>
                  
                  {showRawData && (
                    <Box 
                      sx={{
                        mt: 3,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '24px',
                        fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                        fontSize: '14px',
                        lineHeight: 1.6,
                        color: '#e0e0e0',
                        overflow: 'auto',
                        maxHeight: '400px',
                        textAlign: 'left'
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
                  )}
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
              NFT Risk & Forensics Engine
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                mb: 4,
                fontWeight: 300
              }}
            >
              AI-Powered Risk Assessment & Fraud Detection
            </Typography>
            
            {/* Feature highlights */}
            <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
              <Grid item>
                <Chip 
                  icon={<Security />} 
                  label="Risk Detection" 
                  className="feature-chip"
                />
              </Grid>
              <Grid item>
                <Chip 
                  icon={<Gavel />} 
                  label="Fraud Analysis" 
                  className="feature-chip"
                />
              </Grid>
              <Grid item>
                <Chip 
                  icon={<Assessment />} 
                  label="AI Forensics" 
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
                      Target Analysis
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
                      AI Risk Engine
                    </Typography>
                  </Box>
                  
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<Assessment />}
                          onClick={handleRiskAnalysis}
                          disabled={loading}
                          className="cta-button"
                          sx={{ 
                            mb: 2,
                            height: '56px',
                            fontSize: '1rem',
                            fontWeight: 600
                          }}
                        >
                          Comprehensive Risk Analysis
                        </Button>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<VisibilityOff />}
                          onClick={handleFakeCollectionDetection}
                          disabled={loading}
                          className="cta-button"
                          sx={{ 
                            mb: 2,
                            height: '56px',
                            fontSize: '1rem',
                            fontWeight: 600
                          }}
                        >
                          Fake Collection Detection
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
                          startIcon={<Dangerous />}
                          onClick={handleRugPullPrediction}
                          disabled={loading}
                          className="cta-button"
                          sx={{ 
                            mb: 2,
                            height: '56px',
                            fontSize: '1rem',
                            fontWeight: 600
                          }}
                        >
                          Rug Pull Risk Prediction
                        </Button>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<Map />}
                          onClick={handleFraudMapGeneration}
                          disabled={loading}
                          className="cta-button"
                          sx={{ 
                            height: '56px',
                            fontSize: '1rem',
                            fontWeight: 600
                          }}
                        >
                          Fraud Risk Map
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
          © 2025 NFT Smart Assistant. All rights reserved.
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