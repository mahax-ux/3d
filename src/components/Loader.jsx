import { Html, useProgress } from '@react-three/drei'

const Loader = () => {
  const { progress } = useProgress()

  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        {/* Animated spinner ring */}
        <div className="w-20 h-20 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        
        {/* Live percentage text */}
        <p className="text-xl font-extrabold text-blue-600 tracking-wider">
          {progress.toFixed(0)}% loaded
        </p>
      </div>
    </Html>
  )
}

export default Loader