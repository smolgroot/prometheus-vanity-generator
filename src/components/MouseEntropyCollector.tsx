import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

interface MouseEntropyCollectorProps {
  onEntropyCollected: (entropy: number[]) => void;
}

const MouseEntropyCollector: React.FC<MouseEntropyCollectorProps> = ({ onEntropyCollected }) => {
  const [entropyPoints, setEntropyPoints] = useState<number[]>([]);
  const [coordinates, setCoordinates] = useState<{ x: number; y: number }[]>([]);
  const requiredPoints = 100; // Number of points needed for sufficient entropy
  const lastMeasurementTime = useRef<number>(0); // Track the last measurement time
  const hasNotifiedParent = useRef(false); // Prevent multiple calls to onEntropyCollected

  const handleMouseMove = (event: React.MouseEvent) => {
    const now = Date.now(); // Get the current timestamp

    // Check if 50ms have passed since the last measurement
    if (now - lastMeasurementTime.current < 50) return;

    // Update the last measurement time
    lastMeasurementTime.current = now;

    if (entropyPoints.length >= requiredPoints) return;

    // Get the bounding rectangle of the container
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();

    // Calculate the mouse position relative to the container
    const relativeX = event.clientX - rect.left;
    const relativeY = event.clientY - rect.top;

    // Collect entropy points based on mouse coordinates
    const newPoint = (relativeX ^ relativeY) & 0xff; // XOR and mask to 8 bits
    setEntropyPoints((prev) => [...prev, newPoint]);

    // Save the relative mouse coordinates for rendering points
    setCoordinates((prev) => [...prev, { x: relativeX, y: relativeY }]);
  };

  // Notify the parent component when enough entropy points are collected
  useEffect(() => {
    if (entropyPoints.length >= requiredPoints && !hasNotifiedParent.current) {
      hasNotifiedParent.current = true; // Ensure the parent is notified only once
      onEntropyCollected(entropyPoints); // Call the parent function after the render phase
    }
  }, [entropyPoints, requiredPoints, onEntropyCollected]);

  return (
    <Box
      onMouseMove={handleMouseMove}
      sx={{
        position: 'relative', // Enable positioning for the points
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '500px',
        border: '2px dashed #FE6B8B',
        borderRadius: '8px',
        textAlign: 'center',
        p: 2,
        overflow: 'hidden', // Prevent points from overflowing the box
      }}
    >
      <Typography variant="h6" gutterBottom>
        Move your mouse around to generate entropy
      </Typography>
      <Typography variant="body2" gutterBottom>
        Entropy ensures that the random seeds used for address generation are highly secure and unpredictable. This ensures generated addresses uniqueness.
      </Typography>
      <Typography variant="body2" gutterBottom>
        Entropy collected: {entropyPoints.length} / {requiredPoints}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={(entropyPoints.length / requiredPoints) * 100}
        sx={{ width: '100%', mt: 2 }}
      />

      {/* Render points for each coordinate */}
      {coordinates.map((coord, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            top: coord.y - 5, // Adjust to center the point
            left: coord.x - 5, // Adjust to center the point
            width: '10px',
            height: '10px',
            backgroundColor: 'primary.main', // Use the primary color from the theme
            opacity: 0.5,
            borderRadius: '50%',
            pointerEvents: 'none', // Prevent points from interfering with mouse events
          }}
        />
      ))}
    </Box>
  );
};

export default MouseEntropyCollector;