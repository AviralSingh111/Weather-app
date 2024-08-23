'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../../lib/store';
import { fetchWeatherData } from '../../../lib/store/weatherSlice';
import Link from 'next/link';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import Loader from '@/components/Loader';

function Model() {
  const { scene } = useGLTF('/climate/scene.gltf');
  const groupRef = useRef<THREE.Group>(null);
  const isRotating = useRef(true);

  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      scene.position.sub(center);
      if (groupRef.current) {
        groupRef.current.position.copy(center);
      }
      // Remove the loader
      const loader = document.querySelector('.absolute.inset-0');
      if (loader) loader.remove();
    }
  }, [scene]);

  useFrame((state, delta) => {
    if (groupRef.current && isRotating.current) {
      groupRef.current.rotation.y += delta * 0.4; // y-axis rotation
    }
  });

  useEffect(() => {
    const handlePointerDown = () => {
      isRotating.current = false;
    };

    const handlePointerUp = () => {
      isRotating.current = true;
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  return (
    <group ref={groupRef}>
      <primitive 
        object={scene} 
        scale={[0.03, 0.03, 0.03]}
      />
    </group>
  );
}

function WeatherScene() {
  return (
    <div className="h-[300px] md:h-[400px] lg:h-[500px] relative">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={1.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <Suspense fallback={null}>
          <Model />
        </Suspense>
        <OrbitControls 
          enableRotate={true} 
          enableZoom={false} 
          enablePan={false}
          rotateSpeed={0.5}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader />
      </div>
    </div>
  );
}

function WeatherItem({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white bg-opacity-80 rounded-lg shadow-md">
      <span className="text-4xl mb-2">{icon}</span>
      <span className="text-lg font-semibold">{value}</span>
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  );
}

export default function WeatherDetails() {
  const params = useParams();
  const locality = params.locality as string;
  const dispatch = useDispatch<AppDispatch>();
  const weatherData = useSelector((state: RootState) => state.weather.data);
  const loading = useSelector((state: RootState) => state.weather.loading);
  const error = useSelector((state: RootState) => state.weather.error);

  useEffect(() => {
    if (locality) {
      dispatch(fetchWeatherData(locality));
    }
  }, [locality, dispatch]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-4">
      
      {weatherData && weatherData.locality_weather_data && (
        <div className="flex flex-col items-center">
          {/* Temperature at the top */}
          <div className="text-6xl font-bold text-white mb-8">
            {weatherData.locality_weather_data.temperature}°C
          </div>
          
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 sm:gap-4 gap-0">
            {/* Left side items */}
            <div className="flex flex-col space-y-4">
              <WeatherItem label="Humidity" value={`${weatherData.locality_weather_data.humidity}%`} icon="💧" />
              <WeatherItem label="Wind Speed" value={`${weatherData.locality_weather_data.wind_speed} m/s`} icon="🌬️" />
              <WeatherItem label="Wind Direction" value={`${weatherData.locality_weather_data.wind_direction}°`} icon="🧭" />
            </div>
            
            {/* 3D Model in the center */}
            <div className="h-[300px] md:h-[400px] lg:h-[500px] mt-10">
              <WeatherScene />
            </div>
            
            {/* Right side items */}
            <div className="flex flex-col space-y-4">
              <WeatherItem label="Rain Intensity" value={`${weatherData.locality_weather_data.rain_intensity} mm/hr`} icon="🌧️" />
              <WeatherItem label="Rain Accumulation" value={`${weatherData.locality_weather_data.rain_accumulation} mm`} icon="☔" />
              <WeatherItem 
                label="Device Type" 
                value={weatherData.device_type === 1 ? 'Automated weather system' : 'Rain gauge system'} 
                icon="🔧" 
              />
            </div>
          </div>
        </div>
      )}
      
      <Link href="/" className="sm:mt-0 mt-5 block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out max-w-xs mx-auto">
        Search Another Location
      </Link>
    </div>
  );
}