/**
 * BeeController.jsx
 * Kamera kontrollerini (OrbitControls) ve modelin genel hareket durumlarını denetler.
 * Özellikle kameranın model etrafındaki otomatik dönüşünü (autoRotate) ayarlar.
 */
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useConfigStore } from "../../store/useConfigStore";
import gsap from "gsap";

export const BeeController = ({ controlsRef }) => {
  const { camera } = useThree();
  const selectedPart = useConfigStore((state) => state.selectedPart);

  useEffect(() => {
    if (!controlsRef.current) return;

    // SİMÜLASYON veya YAPAY ZEKA sekmesindeyken engelleri net görmek için kamera dönüşünü durduruyoruz.
    if (selectedPart === "subtitle2" || selectedPart === "subtitle4") {
      controlsRef.current.autoRotate = false;
    } else {
      controlsRef.current.autoRotate = true;
    }

    // Kamera tamamen kullanıcıda kalsın, biz program üzerinden hiç müdahale etmiyoruz.
  }, [selectedPart, camera, controlsRef]);

  return null;
};
