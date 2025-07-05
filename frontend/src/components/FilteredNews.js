import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import NewsCard from './NewsCard';

const FilteredNews = ({ filteredNews, loading, onAnalyze }) => {
  if (loading) return <Typography sx={{ my: 2 }}>Loading filtered news...</Typography>;
  if (!filteredNews || filteredNews.length === 0) return <Typography sx={{ my: 2 }}>No relevant news for your portfolio.</Typography>;
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        Portfolio-Relevant News
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filteredNews.map((item, idx) => (
          <NewsCard
            key={idx}
            headline={item.headline || item.title}
            subtitle={item.summary}
            image={item.image}
            category={item.category}
            time={item.time}
            link={item.link}
          />
        ))}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button onClick={onAnalyze} variant="contained" sx={{ bgcolor: '#2962ff', borderRadius: 2, fontWeight: 600, px: 4, py: 1.2, fontSize: 16 }}>
          Analyze Impact
        </Button>
      </Box>
    </Box>
  );
};

export default FilteredNews; 

// import React from 'react';
// import { Box, Typography, Button } from '@mui/material';
// import NewsCard from './NewsCard';

// const FilteredNews = ({ filteredNews, loading, onAnalyze }) => {
//   if (loading) return <Typography sx={{ my: 2 }}>Loading filtered news...</Typography>;
//   if (!filteredNews || filteredNews.length === 0) return <Typography sx={{ my: 2 }}>No relevant news for your portfolio.</Typography>;
//   return (
//     <Box sx={{ mt: 4 }}>
//       <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
//         Portfolio-Relevant News
//       </Typography>
//       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//         {filteredNews.map((headline, idx) => (
//           <NewsCard key={idx} headline={headline} />
//         ))}
//       </Box>
//       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
//         <Button onClick={onAnalyze} variant="contained" sx={{ bgcolor: '#2962ff', borderRadius: 2, fontWeight: 600, px: 4, py: 1.2, fontSize: 16 }}>
//           Analyze Impact
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default FilteredNews;
