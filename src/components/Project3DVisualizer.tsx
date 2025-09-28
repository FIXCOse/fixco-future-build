import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Text, Environment } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, RotateCcw, Maximize } from 'lucide-react';

interface Project3DVisualizerProps {
  projectType: 'bathroom' | 'kitchen' | 'livingroom' | 'exterior';
  className?: string;
}

const Room3D = ({ type }: { type: string }) => {
  const meshRef = useRef<any>();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  const getRoomGeometry = () => {
    switch (type) {
      case 'bathroom':
        return (
          <group ref={meshRef}>
            {/* Bathroom fixtures */}
            <Box position={[-2, 0, -2]} args={[1, 0.8, 0.6]} material-color="#ffffff" />
            <Box position={[2, 0, -2]} args={[0.6, 1.8, 0.3]} material-color="#f8f8f8" />
            <Box position={[0, -0.4, 0]} args={[4, 0.1, 4]} material-color="#e0e0e0" />
            <Text position={[0, 2, 0]} fontSize={0.3} color="#333333">
              Renoverat Badrum
            </Text>
          </group>
        );
      case 'kitchen':
        return (
          <group ref={meshRef}>
            {/* Kitchen elements */}
            <Box position={[-2, 0, -2]} args={[4, 1, 0.6]} material-color="#8b4513" />
            <Box position={[2, 1, 0]} args={[0.6, 2, 0.6]} material-color="#d2b48c" />
            <Box position={[0, -0.4, 0]} args={[5, 0.1, 4]} material-color="#f5f5dc" />
            <Text position={[0, 2.5, 0]} fontSize={0.3} color="#333333">
              Nytt Kök
            </Text>
          </group>
        );
      case 'exterior':
        return (
          <group ref={meshRef}>
            {/* House exterior */}
            <Box position={[0, 0, 0]} args={[3, 2, 3]} material-color="#cd853f" />
            <Box position={[0, 2, 0]} args={[3.5, 1, 3.5]} material-color="#8b0000" />
            <Sphere position={[3, -0.5, 3]} args={[0.8]} material-color="#228b22" />
            <Text position={[0, 3.5, 0]} fontSize={0.3} color="#333333">
              Fasadrenovering
            </Text>
          </group>
        );
      default:
        return (
          <group ref={meshRef}>
            <Box position={[0, 0, 0]} args={[2, 2, 2]} material-color="#4a90e2" />
            <Text position={[0, 2.5, 0]} fontSize={0.3} color="#333333">
              Projekt Förhandsvisning
            </Text>
          </group>
        );
    }
  };

  return (
    <>
      <Environment preset="city" />
      {getRoomGeometry()}
    </>
  );
};

export const Project3DVisualizer: React.FC<Project3DVisualizerProps> = ({ 
  projectType, 
  className = "" 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const resetView = () => {
    setIsPlaying(false);
    // Reset camera position logic would go here
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Visa i 3D</h3>
        <p className="text-muted-foreground text-sm">
          Interaktiv 3D-förhandsvisning av ditt projekt. Rotera och zooma för att se alla detaljer.
        </p>
      </div>
      
      <div className={`relative bg-gradient-to-b from-sky-200 to-sky-50 rounded-lg overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50' : 'h-80'
      }`}>
        <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Room3D type={projectType} />
            <OrbitControls 
              enablePan={true} 
              enableZoom={true} 
              enableRotate={true}
              autoRotate={isPlaying}
              autoRotateSpeed={2}
            />
          </Suspense>
        </Canvas>
        
        {/* Controls */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          <Button
            size="sm"
            variant={isPlaying ? "default" : "secondary"}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            <Play className="h-4 w-4 mr-1" />
            {isPlaying ? 'Pausa' : 'Spela'}
          </Button>
          <Button size="sm" variant="secondary" onClick={resetView}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" onClick={toggleFullscreen}>
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Info overlay */}
        <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 max-w-xs border border-border">
          <h4 className="font-semibold text-sm">ROT-berättigat projekt</h4>
          <p className="text-xs text-muted-foreground">
            Detta projekt kvalificerar för 50% ROT-avdrag på arbetskostnaden.
          </p>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <Button variant="cta-primary" size="sm">
          Begär offert för detta projekt
        </Button>
      </div>
    </Card>
  );
};