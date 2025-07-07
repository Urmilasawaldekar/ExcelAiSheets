import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { addFile } from '../redux/generatedFilesSlice';
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Download } from "@mui/icons-material";

import { useLocation, useNavigate } from "react-router-dom";
import Chart from '../components/ui/chart';
import Chart3D from '../components/ui/chart3d';

const Analysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [uploadedData, setUploadedData] = useState([]);
  const [selectedChart, setSelectedChart] = useState("bar");
  const [selectedFile, setSelectedFile] = useState("");
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [columnHeaders, setColumnHeaders] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isParsed, setIsParsed] = useState(false);

  const [aiSuggestion, setAiSuggestion] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  useEffect(() => {
    const fetchUploadHistory = async () => {
      try {
        const response = await fetch('/api/history', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            // Defensive filter: only include files uploaded by current user if userId present
            const currentUserId = window.currentUserId || null;
            const filteredData = currentUserId
              ? result.data.filter(file => file.userId === currentUserId)
              : result.data;
            setUploadedData(filteredData);

            // New code: check if navigation state has selectedFileName and set selectedFile accordingly
            if (location.state && location.state.selectedFileName) {
              const selectedFileObj = filteredData.find(file => file.filename === location.state.selectedFileName);
              if (selectedFileObj) {
                const sheetsData = selectedFileObj.sheetsData;
                const firstSheetName = Object.keys(sheetsData)[0];
                const data = sheetsData[firstSheetName];
                if (data && data.length > 0) {
                  const headers = Object.keys(data[0]);
                  setSelectedFile(selectedFileObj.filename);
                  setChartData(data);
                  setColumnHeaders(headers);
                  setIsParsed(true);
                  if (headers.length >= 2) {
                    setXAxis(headers[0]);
                    setYAxis(headers[1]);
                  }
                }
              }
            } else if (filteredData.length > 0) {
              const firstFile = filteredData[0];
              const sheetsData = firstFile.sheetsData;
              const firstSheetName = Object.keys(sheetsData)[0];
              const data = sheetsData[firstSheetName];
              if (data && data.length > 0) {
                const headers = Object.keys(data[0]);
                setSelectedFile(firstFile.filename);
                setChartData(data);
                setColumnHeaders(headers);
                setIsParsed(true);
                if (headers.length >= 2) {
                  setXAxis(headers[0]);
                  setYAxis(headers[1]);
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch upload history:', error);
      }
    };

    fetchUploadHistory();
  }, [location.state]);


  const handleFileChange = (e) => {
    const fileName = e.target.value;
    const selectedFileObj = uploadedData.find(file => file.filename === fileName);
    if (selectedFileObj) {
      const sheetsData = selectedFileObj.sheetsData;
      const firstSheetName = Object.keys(sheetsData)[0];
      const data = sheetsData[firstSheetName];
      if (data && data.length > 0) {
        const headers = Object.keys(data[0]);
        setSelectedFile(fileName);
        setChartData(data);
        setColumnHeaders(headers);
        setIsParsed(true);
        if (headers.length >= 2) {
          setXAxis(headers[0]);
          setYAxis(headers[1]);
        }
      }
    }
  };

  const prepareChartData = () => {
    if (!chartData || chartData.length === 0 || !xAxis || !yAxis) return null;
    try {
      const labels = chartData.map(item => item[xAxis]);
      const dataValues = chartData.map(item => item[yAxis]);
      return {
        labels,
        datasets: [
          {
            label: yAxis,
            data: dataValues,
            backgroundColor: [
              'rgba(75, 192, 192, 0.6)',
              'rgba(255, 99, 132, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
            ],
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      };
    } catch (error) {
      return null;
    }
  };

  const preparedChartData = prepareChartData();

  const downloadChartImage = async () => {
    const chartWrapper = document.querySelector('.recharts-wrapper');
    if (chartWrapper) {
      const canvas = await html2canvas(chartWrapper);
      const link = document.createElement('a');
      link.download = `${selectedFile}_chart.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  useEffect(() => {
    const fetchAiSuggestion = async () => {
      if (!chartData || chartData.length === 0) {
        setAiSuggestion("");
        return;
      }
      setAiLoading(true);
      setAiError(null);
      try {
        const response = await fetch('/api/ai/summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ data: chartData }),
        });
        if (response.ok) {
          const result = await response.json();
          setAiSuggestion(result.summary || "No suggestions available.");
        } else {
          setAiError("Failed to fetch AI suggestions.");
        }
      } catch (error) {
        setAiError("Error fetching AI suggestions.");
      } finally {
        setAiLoading(false);
      }
    };

    fetchAiSuggestion();
  }, [chartData]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Data Analysis
      </Typography>

    

      <Typography variant="body1" align="center" gutterBottom>
        Analyze your Excel data with interactive charts
      </Typography>

      {/* File Selection */}
      <FormControl sx={{ mt: 3, width: 1100}}>
        <InputLabel id="file-select-label">Select File</InputLabel>
        <Select
          labelId="file-select-label"
          value={selectedFile}
          label="Select File"
          onChange={handleFileChange}
        >
          {uploadedData.map((file) => (
            <MenuItem
              key={file.filename}
              value={file.filename}
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span>{file.filename}</span>

            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Axis Dropdowns */}
      {isParsed && columnHeaders.length > 0 && (
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <FormControl sx={{ flex: 1 }}>
            <InputLabel id="x-axis-select-label">Select X Axis</InputLabel>
            <Select
              labelId="x-axis-select-label"
              value={xAxis}
              label="Select X Axis"
              onChange={(e) => setXAxis(e.target.value)}
            >
              {columnHeaders.map((col) => (
                <MenuItem key={col} value={col}>{col}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ flex: 1 }}>
            <InputLabel id="y-axis-select-label">Select Y Axis</InputLabel>
            <Select
              labelId="y-axis-select-label"
              value={yAxis}
              label="Select Y Axis"
              onChange={(e) => setYAxis(e.target.value)}
            >
              {columnHeaders.map((col) => (
                <MenuItem key={col} value={col}>{col}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {/* Chart Type Selection */}
      <FormControl fullWidth sx={{ mt: 3 }}>
        <InputLabel id="chart-type-select-label">Select Chart Type</InputLabel>
        <Select
          labelId="chart-type-select-label"
          value={selectedChart}
          label="Select Chart Type"
          onChange={(e) => setSelectedChart(e.target.value)}
        >
          <MenuItem value="bar">Bar</MenuItem>
          <MenuItem value="line">Line</MenuItem>
          <MenuItem value="pie">Pie</MenuItem>
          <MenuItem value="scatter">Scatter</MenuItem>
          <MenuItem value="3d">3D</MenuItem>
        </Select>
      </FormControl>

      {/* Chart Rendering */}
      {xAxis && yAxis && chartData.length > 0 && (
        <>
          <Box sx={{ mt: 4 }}>
            {selectedChart === '3d' ? (
              <Chart3D data={chartData} xAxis={xAxis} yAxis={yAxis} />
            ) : (
              <Chart
                chartType={selectedChart}
                data={preparedChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: true, position: 'top' },
                    tooltip: { enabled: true },
                  },
                  scales: {
                    x: { title: { display: true, text: xAxis } },
                    y: { title: { display: true, text: yAxis } },
                  },
                }}
                recordId={uploadedData.find(file => file.filename === selectedFile)?._id}
              />
            )}
          </Box>

          {/* AI Suggestions Box */}
          <Box sx={{ border: '2px dashed #4caf50', borderRadius: 2, p: 2, mt: 4, backgroundColor: '#e8f5e9' }}>
            <Typography variant="h6" gutterBottom>
              AI Suggestions
            </Typography>
          <Typography variant="body2">
            Based on the analysis done, here are some AI-generated suggestions to improve your data insights.
          </Typography>
          {aiLoading && <Typography variant="body2" color="text.secondary">Loading AI suggestions...</Typography>}
          {aiError && <Typography variant="body2" color="error">{aiError}</Typography>}
          {!aiLoading && !aiError && aiSuggestion && (
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>
              {aiSuggestion}
            </Typography>
          )}
        </Box>
      </>
    )}

     
    </Box>
  );
};

export default Analysis;
