/**
 * BeeController.jsx
 * Kamera kontrollerini (OrbitControls) ve modelin genel hareket durumlarını denetler.
 * Özellikle kameranın model etrafındaki otomatik dönüşünü (autoRotate) ayarlar.
 */
import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useConfigStore } from "../store/useConfigStore";
import gsap from "gsap";

export const BeeController = ({ controlsRef }) => {
  const { camera } = useThree();
  const selectedPart = useConfigStore((state) => state.selectedPart);
  const prevPartRef = useRef(null);

  useEffect(() => {
    if (!controlsRef.current) return;

    if (selectedPart === "subtitle2" || selectedPart === "subtitle4") {
      controlsRef.current.autoRotate = false;
      controlsRef.current.enableRotate = false;
      controlsRef.current.enableZoom = false;
      controlsRef.current.enablePan = false;
    } else {
      controlsRef.current.autoRotate = true;
      controlsRef.current.enableRotate = true;
      controlsRef.current.enableZoom = true;
      controlsRef.current.enablePan = true;
    }

    if (selectedPart === "subtitle2") {
      gsap.killTweensOf(camera.position);
      gsap.killTweensOf(controlsRef.current.target);
      // Ana sayfada model nereye dönük olursa olsun her zaman sabit,
      // aşağı indirilmiş (y: -0.2) standart görünüme sabitliyoruz.
      gsap.to(camera.position, {
        x: 2.2,
        y: -0.2,
        z: 2.2,
        duration: 1.6,
        ease: "power2.inOut",
        onUpdate: () => controlsRef.current?.update(),
      });
      gsap.to(controlsRef.current.target, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.6,
        ease: "power2.inOut",
        onUpdate: () => controlsRef.current?.update(),
      });
    } else if (selectedPart === "subtitle4") {
      // Yapay Zeka (subtitle4) için ayrı blok: Kamera modelin arkasında (3. şahıs görünümü)
      gsap.killTweensOf(camera.position);
      gsap.killTweensOf(controlsRef.current.target);
      gsap.to(camera.position, {
        x: 0,
        y: 0.8,
        z: -4.5, // Daha uzaktan bakış
        duration: 1.6,
        ease: "power2.inOut",
        onUpdate: () => controlsRef.current?.update(),
      });
      gsap.to(controlsRef.current.target, {
        x: 0,
        y: -0.5, // Merkezin altına bakarak modeli ekranın yukarısına taşıyor
        z: 0,
        duration: 1.6,
        ease: "power2.inOut",
        onUpdate: () => controlsRef.current?.update(),
      });
    } else if (
      prevPartRef.current === "subtitle2" ||
      prevPartRef.current === "subtitle4"
    ) {
      gsap.killTweensOf(camera.position);
      gsap.killTweensOf(controlsRef.current.target);
      gsap.to(camera.position, {
        x: 1.5,
        y: 0.4,
        z: 1.5,
        duration: 1.6,
        ease: "power2.inOut",
        onUpdate: () => controlsRef.current?.update(),
      });
      gsap.to(controlsRef.current.target, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.6,
        ease: "power2.inOut",
        onUpdate: () => controlsRef.current?.update(),
      });
    }

    prevPartRef.current = selectedPart;
  }, [selectedPart, camera, controlsRef]);

  return null;
};
