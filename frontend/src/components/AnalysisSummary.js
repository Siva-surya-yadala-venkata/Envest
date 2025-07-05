import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function extractJsonArray(text) {
  // Try to extract the first JSON array in the text, even if it's malformed
  const start = text.indexOf('[');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    let jsonStr = text.slice(start, end + 1);
    // Try to fix missing closing bracket
    if (!jsonStr.trim().endsWith(']')) {
      jsonStr += ']';
    }
    try {
      return JSON.parse(jsonStr);
    } catch {
      // Try to fix missing commas between objects
      jsonStr = jsonStr.replace(/}\s*{/g, '}, {');
      try {
        return JSON.parse(jsonStr);
      } catch {
        return null;
      }
    }
  }
  return null;
}

function summarizeImpacts(parsed) {
  // Group by symbol and determine the most severe impact
  const impactRank = { Negative: 3, Positive: 2, Neutral: 1 };
  const summary = {};
  parsed.forEach(item => {
    const sym = item.symbol;
    if (!summary[sym]) {
      summary[sym] = { impact: item.impact, reasons: [item.reason] };
    } else {
      // Choose the most severe impact
      if (impactRank[item.impact] > impactRank[summary[sym].impact]) {
        summary[sym].impact = item.impact;
      }
      summary[sym].reasons.push(item.reason);
    }
  });
  // Convert to array
  return Object.entries(summary).map(([symbol, { impact, reasons }]) => ({
    symbol,
    impact,
    reason: reasons.join(' | ')
  }));
}

const AnalysisSummary = ({ analysis, loading }) => {
  if (loading) return <Typography>Analyzing news impact...</Typography>;
  if (!analysis) return <Typography>No analysis yet.</Typography>;

  let parsed = Array.isArray(analysis) ? analysis : extractJsonArray(analysis);
  if (parsed && Array.isArray(parsed)) {
    const summarized = summarizeImpacts(parsed);
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          AI Portfolio Impact Analysis
        </Typography>
        {summarized.map((item, idx) => (
          <Paper key={idx} sx={{ p: 2, mb: 2, borderLeft: `6px solid ${
            item.impact === 'Positive' ? '#43a047' : item.impact === 'Negative' ? '#e53935' : '#ffa000'
          }` }}>
            <Typography variant="subtitle1" fontWeight={700}>
              {item.symbol}: <span style={{
                color: item.impact === 'Positive' ? '#43a047' : item.impact === 'Negative' ? '#e53935' : '#ffa000'
              }}>{item.impact}</span>
            </Typography>
            <Typography variant="body2" color="text.secondary">{item.reason}</Typography>
          </Paper>
        ))}
      </Box>
    );
  }

  // Fallback: show the raw text
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        AI Portfolio Impact Analysis
      </Typography>
      <Typography>{analysis}</Typography>
    </Box>
  );
};

export default AnalysisSummary; 