import React, { useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '@mui/material';
import axios from 'axios';

Chart.register(...registerables);

const ChartJS2D = ({ type, data, options }) => {
  const canvasRef = useRef(null);
  const chartInstance = React.useRef(null);

  React.useEffect(() => {
    if (canvasRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      chartInstance.current = new Chart(canvasRef.current, {
        type,
        data,
        options,
      });
    }
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [type, data, options]);

  return <canvas ref={canvasRef} style={{ maxWidth: '100%', maxHeight: '400px' }} />;
};

const ChartComponent = ({ chartType, data, options, recordId }) => {
  const containerRef = useRef(null);

  const exportPNG = () => {
    if (containerRef.current) {
      const canvas = containerRef.current.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.download = 'chart.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    }
  };

  const exportPDF = () => {
    if (!containerRef.current) return;
    html2canvas(containerRef.current).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('chart.pdf');
    });
  };

  const recordChartGeneration = async () => {
    try {
      // Ensure the JWT token is sent in the Authorization header
      const token = document.cookie.split('; ').find(row => row.startsWith('token='));
      const authHeader = token ? { Authorization: `Bearer ${token.split('=')[1]}` } : {};

      await axios.post('/api/admin/chart-generated', { chartType }, { headers: authHeader, withCredentials: true });
      console.log('Chart generation recorded');

      // New: Record recent chart creation
      if (recordId) {
        await axios.post('/api/recentCharts', { recordId, chartType }, { headers: authHeader, withCredentials: true });
        console.log('Recent chart recorded');
      }
    } catch (error) {
      console.error('Failed to record chart generation or recent chart', error);
    }
  };

  React.useEffect(() => {
    if (chartType) {
      recordChartGeneration();
    }
  }, [chartType]);

  return (
    <div>
      <div ref={containerRef}>
        <ChartJS2D type={chartType} data={data} options={options} />
      </div>
      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <Button variant="contained" color="primary" onClick={exportPNG} sx={{ mr: 1 }}>
          Download PNG
        </Button>
        <Button variant="contained" color="secondary" onClick={exportPDF}>
          Download PDF
        </Button>
      </div>
    </div>
  );
};

export default ChartComponent;
