import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Star, ShoppingCart, Heart, ArrowRight, User, MessageCircle, Zap, Shield, Award, X, RotateCcw } from 'lucide-react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WebGiViewer from './WebGiViewer'; 
// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  const [selectedBagId, setSelectedBagId] = useState(null);
  const [selectedColor, setSelectedColor] = useState('blue');
  const [isLoaded, setIsLoaded] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentBagIndex, setCurrentBagIndex] = useState(0);
  const [viewerActive, setViewerActive] = useState(false);
  const [current3DBag, setCurrent3DBag] = useState(null);
  const heroCanvasRef = useRef();
  const sceneRef = useRef();
  const rendererRef = useRef();
  const cameraRef = useRef();
  const meshesRef = useRef([]);
  const productSectionRef = useRef();
  const heroContentRef = useRef();
  const featuresRef = useRef([]);
  const webgiRef = useRef(null);

  const bags = [
    {
      id: 1,
      name: "Explorer Pro Backpack",
      price: "$45",
      originalPrice: "$65",
      rating: 4.8,
      reviews: 342,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
      model: `${import.meta.env.BASE_URL}models/school_bag.glb`, // Path to 3D model
      colors: ["blue", "red", "green", "purple"],
      features: ["Water Resistant", "Multiple Compartments", "Ergonomic Design", "Anti-theft Zippers"],
      description: "Perfect for adventurous students who need durability and style."
    },
    {
      id: 2,
      name: "Adventure Elite Pack",
      price: "$52",
      originalPrice: "$72",
      rating: 4.9,
      reviews: 128,
      image: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=500",
      model: `${import.meta.env.BASE_URL}models/school_bag.glb`, // Path to 3D model
      colors: ["black", "navy", "gray", "red"],
      features: ["Laptop Compartment", "Anti-Theft Zippers", "Reflective Strips", "USB Charging Port"],
      description: "Elite performance for tech-savvy students with modern needs."
    },
    {
      id: 3,
      name: "Study Buddy Deluxe",
      price: "$38",
      originalPrice: "$55",
      rating: 4.7,
      reviews: 256,
      image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500",
      model: `${import.meta.env.BASE_URL}models/school_bag.glb`, // Path to 3D model
      colors: ["pink", "purple", "blue", "green"],
      features: ["Lightweight", "Easy Clean", "Adjustable Straps", "Book Organizer"],
      description: "Lightweight companion for everyday school adventures."
    }
  ];

  const colorVariants = {
    blue: "#3B82F6",
    red: "#EF4444", 
    green: "#10B981",
    purple: "#8B5CF6",
    black: "#1F2937",
    navy: "#1E3A8A",
    gray: "#6B7280",
    pink: "#EC4899"
  };

  // Initialize Three.js scene
  const initThreeJS = () => {
    if (!heroCanvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: heroCanvasRef.current,
      alpha: true,
      antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Create floating geometric shapes
    const geometries = [
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.SphereGeometry(0.7, 32, 32),
      new THREE.OctahedronGeometry(0.8),
      new THREE.TetrahedronGeometry(0.9)
    ];

    const materials = [
      new THREE.MeshBasicMaterial({ color: 0x667eea, wireframe: true, transparent: true, opacity: 0.6 }),
      new THREE.MeshBasicMaterial({ color: 0x764ba2, wireframe: true, transparent: true, opacity: 0.4 }),
      new THREE.MeshBasicMaterial({ color: 0x3B82F6, wireframe: true, transparent: true, opacity: 0.5 }),
      new THREE.MeshBasicMaterial({ color: 0x8B5CF6, wireframe: true, transparent: true, opacity: 0.7 })
    ];

    // Create multiple floating objects
    for (let i = 0; i < 15; i++) {
      const mesh = new THREE.Mesh(
        geometries[Math.floor(Math.random() * geometries.length)],
        materials[Math.floor(Math.random() * materials.length)]
      );
      
      mesh.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      scene.add(mesh);
      meshesRef.current.push(mesh);
    }

    camera.position.z = 10;
    
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    animate();
  };

  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);
    
    if (meshesRef.current.length > 0) {
      meshesRef.current.forEach((mesh, index) => {
        mesh.rotation.x += 0.005 * (index + 1);
        mesh.rotation.y += 0.005 * (index + 1);
        mesh.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002;
      });
    }

    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  };

  // Initialize GSAP animations
  useEffect(() => {
    // Animate hero content
    gsap.fromTo(heroContentRef.current, 
      { y: 100, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 1.5, 
        ease: "power3.out",
        onComplete: () => setIsLoaded(true)
      }
    );

    // Animate product cards on scroll
    if (productSectionRef.current) {
      const cards = productSectionRef.current.querySelectorAll('.product-card');
      
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          }
        );
      });
    }

    // Animate features on scroll
    featuresRef.current.forEach((feature, i) => {
      gsap.fromTo(feature,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          delay: i * 0.2,
          scrollTrigger: {
            trigger: feature,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    });

    // Parallax effect for hero section
    gsap.to(heroContentRef.current, {
      y: (i, target) => -ScrollTrigger.maxScroll(window) * 0.1,
      ease: "none",
      scrollTrigger: {
        trigger: heroContentRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

  }, []);

  // Initialize Three.js hero background once mounted
  useEffect(() => {
    initThreeJS();
  }, []);

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Update camera based on mouse position
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.x = mousePos.x * 2;
      cameraRef.current.position.y = mousePos.y * 2;
      cameraRef.current.lookAt(0, 0, 0);
    }
  }, [mousePos]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBagIndex((prev) => (prev + 1) % bags.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleSelectedBag = (id) => {
    setSelectedBagId(selectedBagId === id ? null : id);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! We'll get back to you soon.");
    setContactForm({ name: "", email: "", message: "" });
  };

  const open3DViewer = (bag) => {
    setCurrent3DBag(bag);
    setViewerActive(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  };

  const close3DViewer = () => {
    setViewerActive(false);
    setCurrent3DBag(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
    try { webgiRef.current?.dispose?.(); } catch (_) {}
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", overflow: 'hidden', background: '#0a0a0a' }}>
      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: #0a0a0a;
          color: #ffffff;
        }

        .floating-animation {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        .glow-effect {
          box-shadow: 0 0 30px rgba(102, 126, 234, 0.5);
          animation: glow-pulse 2s ease-in-out infinite alternate;
        }

        @keyframes glow-pulse {
          from { box-shadow: 0 0 30px rgba(102, 126, 234, 0.5); }
          to { box-shadow: 0 0 50px rgba(102, 126, 234, 0.8); }
        }

        .slide-in-left {
          animation: slideInLeft 1s ease-out;
        }

        @keyframes slideInLeft {
          from { transform: translateX(-100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .slide-in-right {
          animation: slideInRight 1s ease-out;
        }

        @keyframes slideInRight {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .scale-on-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .scale-on-hover:hover {
          transform: scale(1.05) rotateY(5deg);
        }

        .neon-text {
          text-shadow: 0 0 10px #667eea, 0 0 20px #667eea, 0 0 30px #667eea;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
        }

        .gradient-border {
          background: linear-gradient(45deg, #667eea, #764ba2, #667eea);
          background-size: 300% 300%;
          animation: gradient-animation 4s ease infinite;
        }

        @keyframes gradient-animation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .pulse-scale {
          animation: pulseScale 2s ease-in-out infinite;
        }

        @keyframes pulseScale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .text-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* 3D Viewer Styles */
        .viewer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .viewer-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        .viewer-container {
          width: 90%;
          height: 90%;
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 0 50px rgba(102, 126, 234, 0.5);
          transform: scale(0.9);
          transition: transform 0.5s ease;
        }

        .viewer-overlay.active .viewer-container {
          transform: scale(1);
        }

        .viewer-controls {
          position: absolute;
          top: 20px;
          right: 20px;
          display: flex;
          gap: 15px;
          z-index: 10;
        }

        .viewer-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(102, 126, 234, 0.3);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: white;
        }

        .viewer-btn:hover {
          background: rgba(102, 126, 234, 0.5);
          transform: scale(1.1);
        }

        .viewer-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 2rem;
          background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
          color: white;
          z-index: 5;
        }

        .webgi-canvas {
          width: 100%;
          height: 100%;
          outline: none;
        }
      `}</style>

      {/* 3D Viewer Overlay */}
      <div className={`viewer-overlay ${viewerActive ? 'active' : ''}`}>
        {viewerActive && current3DBag && (
          <div className="viewer-container">
            <WebGiViewer 
              ref={webgiRef}
              modelPath={current3DBag.model} 
              className="webgi-canvas"
            />
            <div className="viewer-controls">
              <button className="viewer-btn" onClick={close3DViewer}>
                <X size={24} />
              </button>
              <button className="viewer-btn" onClick={() => webgiRef.current?.resetCamera?.()}>
                <RotateCcw size={24} />
              </button>
            </div>
            <div className="viewer-content">
              <h2>{current3DBag.name}</h2>
              <p>{current3DBag.description}</p>
            </div>
          </div>
        )}
      </div>

      {/* Floating Navbar */}
      <header style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(15px)',
        borderRadius: '50px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '10px 30px'
      }}>
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '40px'
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <ShoppingCart size={28} style={{ color: '#667eea' }} />
            BagVerse
          </div>
          <div style={{
            display: 'flex',
            gap: '30px',
            color: '#ffffff',
            fontSize: '0.95rem',
            fontWeight: 500
          }}>
            {['Home', 'Products', 'About', 'Contact'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{
                textDecoration: 'none',
                color: '#ffffff',
                transition: 'all 0.3s ease',
                padding: '8px 16px',
                borderRadius: '20px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(102, 126, 234, 0.2)';
                e.target.style.color = '#667eea';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#ffffff';
              }}>
                {item}
              </a>
            ))}
          </div>
        </nav>
      </header>

      {/* Hero Section with 3D Background */}
      <section id="home" style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center'
      }}>
        <canvas 
          ref={heroCanvasRef} 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1
          }}
        />
        
        <div ref={heroContentRef} style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center'
        }}>
          <div className={isLoaded ? 'slide-in-left' : ''} style={{
            color: '#ffffff'
          }}>
            <div style={{
              fontSize: '1.2rem',
              color: '#667eea',
              fontWeight: 600,
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}>
              Premium School Collection
            </div>
            <h1 className="neon-text" style={{
              fontSize: '4rem',
              fontWeight: 900,
              marginBottom: '1.5rem',
              lineHeight: 1.1,
              background: 'linear-gradient(135deg, #ffffff 0%, #667eea 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Future-Ready School Bags
            </h1>
            <p style={{
              fontSize: '1.3rem',
              marginBottom: '3rem',
              opacity: 0.8,
              lineHeight: 1.7,
              color: '#b8c5d6'
            }}>
              Experience the next generation of school bags with cutting-edge design, 
              smart features, and unmatched durability for today's students.
            </p>
            
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem' }}>
              <button className="glow-effect" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '18px 35px',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px) scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0) scale(1)'}
              >
                Explore Now <ArrowRight size={22} />
              </button>
              
              <button style={{
                background: 'transparent',
                color: '#667eea',
                border: '2px solid #667eea',
                padding: '16px 33px',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#667eea';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#667eea';
                e.target.style.transform = 'translateY(0)';
              }}>
                Watch Video
              </button>
            </div>

            <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#667eea' }}>10K+</div>
                <div style={{ fontSize: '0.95rem', opacity: 0.7 }}>Happy Students</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#667eea' }}>4.9★</div>
                <div style={{ fontSize: '0.95rem', opacity: 0.7 }}>Average Rating</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#667eea' }}>50+</div>
                <div style={{ fontSize: '0.95rem', opacity: 0.7 }}>Unique Designs</div>
              </div>
            </div>
          </div>

          <div className={`floating-animation ${isLoaded ? 'slide-in-right' : ''}`} style={{
            display: 'flex',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <div style={{
              width: '450px',
              height: '450px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid rgba(102, 126, 234, 0.5)',
              position: 'relative',
              overflow: 'hidden'
            }} className="pulse-scale">
              <div style={{
                width: '350px',
                height: '350px',
                borderRadius: '20px',
                overflow: 'hidden',
                background: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(255, 255, 255, 0.1)'
              }}>
                <img 
                  key={currentBagIndex}
                  src={bags[currentBagIndex].image}
                  alt={bags[currentBagIndex].name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'all 1s ease',
                    transform: 'scale(1.1)'
                  }}
                />
              </div>
              
              {/* Floating price tag */}
              <div style={{
                position: 'absolute',
                top: '30px',
                right: '30px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '10px 20px',
                borderRadius: '25px',
                color: 'white',
                fontWeight: 700,
                fontSize: '1.2rem',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)'
              }} className="floating-animation">
                {bags[currentBagIndex].price}
              </div>

              {/* 3D View Button */}
              <button 
                onClick={() => open3DViewer(bags[currentBagIndex])}
                style={{
                  position: 'absolute',
                  bottom: '30px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: '#667eea',
                  border: '2px solid #667eea',
                  padding: '10px 20px',
                  borderRadius: '25px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#667eea';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(0, 0, 0, 0.7)';
                  e.target.style.color = '#667eea';
                }}
              >
                <span>View in 3D</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: '6rem 2rem',
        background: '#0f0f0f',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '3rem',
            fontWeight: 800,
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Why Choose BagVerse?
          </h2>
          <p style={{ fontSize: '1.2rem', opacity: 0.7, marginBottom: '4rem', maxWidth: '600px', margin: '0 auto 4rem' }}>
            Revolutionary features that redefine what a school bag can be
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {[
              { icon: Shield, title: "Ultra Durable", desc: "Military-grade materials for long-lasting performance" },
              { icon: Zap, title: "Smart Features", desc: "USB charging ports and tech-friendly compartments" },
              { icon: Award, title: "Award Winning", desc: "Recognized globally for innovation and design" }
            ].map((feature, i) => (
              <div 
                key={i} 
                ref={el => featuresRef.current[i] = el}
                className="glass-card scale-on-hover" 
                style={{
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                <feature.icon size={60} style={{ color: '#667eea', marginBottom: '1.5rem' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#fff' }}>
                  {feature.title}
                </h3>
                <p style={{ opacity: 0.7, lineHeight: 1.6 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" ref={productSectionRef} style={{
        padding: '6rem 2rem',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{
              fontSize: '3.5rem',
              fontWeight: 900,
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Premium Collection
            </h2>
            <p style={{ fontSize: '1.3rem', opacity: 0.7, maxWidth: '700px', margin: '0 auto' }}>
              Discover our meticulously crafted school bags designed for the modern student
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '3rem'
          }}>
            {bags.map((bag, index) => (
              <div
                key={bag.id}
                className="product-card glass-card scale-on-hover"
                style={{
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                onClick={() => toggleSelectedBag(bag.id)}
              >
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={bag.image}
                    alt={bag.name}
                    style={{
                      width: '100%',
                      height: '300px',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  />
                  
                  {/* Floating badges */}
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    padding: '6px 12px',
                    borderRadius: '15px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'white'
                  }}>
                    HOT DEAL
                  </div>
                  
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    borderRadius: '50%',
                    width: '45px',
                    height: '45px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    <Heart size={20} color="#ef4444" />
                  </div>

                  {/* 3D View Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      open3DViewer(bag);
                    }}
                    style={{
                      position: 'absolute',
                      bottom: '20px',
                      right: '20px',
                      background: 'rgba(102, 126, 234, 0.8)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 15px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(102, 126, 234, 1)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(102, 126, 234, 0.8)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <span>3D View</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
                
                <div style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 700, 
                        color: '#fff', 
                        marginBottom: '0.5rem' 
                      }}>
                        {bag.name}
                      </h3>
                      <p style={{ color: '#b8c5d6', fontSize: '0.95rem' }}>{bag.description}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ 
                        fontSize: '1.8rem', 
                        fontWeight: 900, 
                        color: '#667eea',
                        lineHeight: 1
                      }}>
                        {bag.price}
                      </div>
                      <div style={{ 
                        fontSize: '1rem', 
                        color: '#6b7280', 
                        textDecoration: 'line-through' 
                      }}>
                        {bag.originalPrice}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ display: 'flex' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            fill={i < Math.floor(bag.rating) ? '#fbbf24' : 'none'}
                            color="#fbbf24"
                          />
                        ))}
                      </div>
                      <span style={{ color: '#b8c5d6', fontSize: '0.9rem' }}>
                        {bag.rating} ({bag.reviews} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Color Options */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '0.9rem', color: '#b8c5d6', marginBottom: '0.8rem', fontWeight: 600 }}>
                      Available Colors:
                    </p>
                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                      {bag.colors.map(color => (
                        <div
                          key={color}
                          style={{
                            width: '35px',
                            height: '35px',
                            borderRadius: '50%',
                            background: colorVariants[color],
                            cursor: 'pointer',
                            border: selectedColor === color ? '3px solid #667eea' : '3px solid rgba(255,255,255,0.2)',
                            transition: 'all 0.3s ease',
                            boxShadow: selectedColor === color ? `0 0 20px ${colorVariants[color]}50` : 'none'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedColor(color);
                          }}
                          onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        />
                      ))}
                    </div>
                  </div>

                  {selectedBagId === bag.id && (
                    <div style={{ 
                      marginBottom: '1.5rem',
                      padding: '1.5rem',
                      background: 'rgba(102, 126, 234, 0.1)',
                      borderRadius: '15px',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      animation: 'slideInLeft 0.5s ease-out'
                    }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#667eea' }}>
                        Premium Features:
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                        {bag.features.map((feature, i) => (
                          <div key={i} style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: '#b8c5d6',
                            fontSize: '0.9rem'
                          }}>
                            <div style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: '#667eea'
                            }} />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '1rem',
                      borderRadius: '15px',
                      fontSize: '1rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-3px)';
                      e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                    >
                      <ShoppingCart size={18} />
                      Add to Cart
                    </button>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        open3DViewer(bag);
                      }}
                      style={{
                        background: 'transparent',
                        color: '#667eea',
                        border: '2px solid #667eea',
                        padding: '1rem',
                        borderRadius: '15px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        minWidth: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#667eea';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#667eea';
                      }}
                    >
                      3D
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{
        padding: '6rem 2rem',
        background: '#0a0a0a',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 900,
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              About BagVerse
            </h2>
            <p style={{ color: '#b8c5d6', lineHeight: 1.8, fontSize: '1.1rem', marginBottom: '2rem' }}>
              We craft future-ready school bags that blend durability, comfort, and smart functionality. 
              Our mission is to empower students with gear that keeps up with their ambitions—on campus and beyond.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="glass-card" style={{ padding: '1.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                  <Shield size={20} style={{ color: '#667eea' }} />
                  <span style={{ fontWeight: 700 }}>Built to Last</span>
                </div>
                <p style={{ color: '#9aa7b8', fontSize: '0.95rem' }}>Premium materials and reinforced stitching for everyday adventures.</p>
              </div>
              <div className="glass-card" style={{ padding: '1.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                  <Zap size={20} style={{ color: '#667eea' }} />
                  <span style={{ fontWeight: 700 }}>Smart by Design</span>
                </div>
                <p style={{ color: '#9aa7b8', fontSize: '0.95rem' }}>Thoughtful compartments, tech sleeves, and anti-theft details.</p>
              </div>
              <div className="glass-card" style={{ padding: '1.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                  <Award size={20} style={{ color: '#667eea' }} />
                  <span style={{ fontWeight: 700 }}>Trusted Worldwide</span>
                </div>
                <p style={{ color: '#9aa7b8', fontSize: '0.95rem' }}>Loved by 10,000+ students with a 4.9 average rating.</p>
              </div>
            </div>
          </div>
          <div>
            <div className="glass-card" style={{
              padding: '2rem',
              borderRadius: '20px',
              background: 'radial-gradient(1200px 200px at 0% 0%, rgba(102,126,234,0.15), transparent), rgba(255,255,255,0.04)'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <div style={{ color: '#667eea', fontWeight: 800, fontSize: '2rem' }}>50+</div>
                  <div style={{ color: '#9aa7b8' }}>Unique designs</div>
                </div>
                <div>
                  <div style={{ color: '#667eea', fontWeight: 800, fontSize: '2rem' }}>10K+</div>
                  <div style={{ color: '#9aa7b8' }}>Happy students</div>
                </div>
                <div>
                  <div style={{ color: '#667eea', fontWeight: 800, fontSize: '2rem' }}>4.9★</div>
                  <div style={{ color: '#9aa7b8' }}>Avg. rating</div>
                </div>
                <div>
                  <div style={{ color: '#667eea', fontWeight: 800, fontSize: '2rem' }}>24/7</div>
                  <div style={{ color: '#9aa7b8' }}>Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{
        padding: '6rem 2rem',
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 900,
              marginBottom: '0.7rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Get in Touch
            </h2>
            <p style={{ color: '#b8c5d6', opacity: 0.8 }}>Questions about our bags or your order? We’re here to help.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '2rem' }}>
            {/* Form */}
            <form onSubmit={handleContactSubmit} className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', color: '#cfd8e3', fontSize: '0.95rem' }}>Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#667eea' }} />
                    <input
                      id="name"
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 38px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.15)',
                        background: 'rgba(255,255,255,0.06)',
                        color: 'white',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', color: '#cfd8e3', fontSize: '0.95rem' }}>Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#667eea' }} />
                    <input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 38px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.15)',
                        background: 'rgba(255,255,255,0.06)',
                        color: 'white',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem', color: '#cfd8e3', fontSize: '0.95rem' }}>Message</label>
                <div style={{ position: 'relative' }}>
                  <MessageCircle size={18} style={{ position: 'absolute', top: '14px', left: '12px', color: '#667eea' }} />
                  <textarea
                    id="message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    required
                    rows={6}
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 38px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.15)',
                      background: 'rgba(255,255,255,0.06)',
                      color: 'white',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="glow-effect" style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '14px 24px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '0.5px'
                }}>
                  Send Message
                </button>
              </div>
            </form>

            {/* Contact Info */}
            <div className="glass-card" style={{ padding: '2rem', height: '100%' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem', color: '#fff' }}>Contact Details</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#b8c5d6' }}>
                  <MapPin size={20} style={{ color: '#667eea' }} />
                  <span>Belghoria, Kolkata, West Bengal</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#b8c5d6' }}>
                  <Phone size={20} style={{ color: '#667eea' }} />
                  <span>+91 9876543210</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#b8c5d6' }}>
                  <Mail size={20} style={{ color: '#667eea' }} />
                  <span>support@abhirup.com</span>
                </div>
              </div>
              <div style={{ marginTop: '2rem', padding: '1rem', borderRadius: '12px', background: 'rgba(102,126,234,0.08)', border: '1px solid rgba(102,126,234,0.2)' }}>
                <div style={{ color: '#9aa7b8', fontSize: '0.95rem' }}>Response time: within 24 hours on business days.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#0a0a0a',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '3rem 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '2rem' }}>
          <div>
            <div style={{
              fontSize: '1.6rem',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.5rem'
            }}>
              BagVerse
            </div>
            <p style={{ color: '#9aa7b8', fontSize: '0.95rem' }}>Premium, durable, and smart school bags for modern learners.</p>
          </div>
          <div>
            <h4 style={{ color: '#cfd8e3', marginBottom: '0.8rem' }}>Quick Links</h4>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <a href="#home" style={{ color: '#9aa7b8', textDecoration: 'none' }}>Home</a>
              <a href="#products" style={{ color: '#9aa7b8', textDecoration: 'none' }}>Products</a>
              <a href="#about" style={{ color: '#9aa7b8', textDecoration: 'none' }}>About</a>
              <a href="#contact" style={{ color: '#9aa7b8', textDecoration: 'none' }}>Contact</a>
            </div>
          </div>
          <div>
            <h4 style={{ color: '#cfd8e3', marginBottom: '0.8rem' }}>Contact</h4>
            <div style={{ display: 'grid', gap: '0.5rem', color: '#9aa7b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Phone size={18} style={{ color: '#667eea' }} /> +1 (555) 123-4567</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Mail size={18} style={{ color: '#667eea' }} /> support@bagverse.com</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><MapPin size={18} style={{ color: '#667eea' }} /> San Francisco, CA</div>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '1.5rem auto 0', color: '#6b7280', fontSize: '0.9rem', textAlign: 'center' }}>
          © {new Date().getFullYear()} BagVerse. All rights reserved.
        </div>
      </footer>

    </div>
  );
};

export default HomePage;