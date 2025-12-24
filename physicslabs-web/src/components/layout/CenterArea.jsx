// components/layout/CenterArea.jsx
import { Box, Text } from '@mantine/core';

export default function CenterArea() {
  return (
    <Box sx={{ flex: 1, position: 'relative' }}>
      <Box p="md" sx={{ height: '50%', borderBottom: '1px solid #3f3f46' }}>
        <Text>3D View Area</Text>
      </Box>
      <Box p="md" sx={{ height: '50%' }}>
        <Text>2D View Area</Text>
      </Box>
    </Box>
  );
}
