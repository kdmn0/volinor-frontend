/**
 * BeeModel.jsx
 * 3D arı (bee) modelini yükleyen ve sahnede gösteren bileşendir.
 * Model üzerindeki animasyonları (kanat çırpma vb.) ve parçaların görünürlüğünü
 * (X-Ray şeffaflık modu gibi) `useFrame` ile frame (kare) bazlı yönetir.
 */
import { useGLTF, Html } from "@react-three/drei";
import { useConfigStore } from "../store/useConfigStore";
import { useLayoutEffect, useMemo, useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTranslation } from "react-i18next";

export function BeeModel(props) {
  const { scene } = useGLTF("/models/bee_compressed.glb");
  const selectedPart = useConfigStore((state) => state.selectedPart);
  const activePage = useConfigStore((state) => state.activePage);
  const body47Refs = useRef([]);
  const body63Refs = useRef([]);
  const groupRef = useRef();
  const explodeData = useRef([]);

  // Kanat animasyonunun fazı ve hızı için referanslar (kademeli geçiş için)
  const wingPhase = useRef(0);
  const currentWingSpeed = useRef(10);

  // Orijinal materyalleri sakla ve renk ayarlamaları yap
  const originalMaterials = useMemo(() => {
    const materials = {};
    const sharedClones = {}; // Performans için: Aynı materyali tekrar tekrar klonlamak yerine cache'liyoruz

    scene.traverse((child) => {
      if (child.isMesh) {
        let isWing = false;
        let currentParent = child; // Mesh'in kendisini ve üst gruplarını kontrol edelim
        while (currentParent) {
          if (
            currentParent.name &&
            (currentParent.name.includes("Component6(Mirror)") ||
              currentParent.name.includes("Component55"))
          ) {
            isWing = true;
            break;
          }
          currentParent = currentParent.parent;
        }

        // Her mesh için clone yapmak yerine benzersiz durumlar için bir key oluşturuyoruz:
        const cacheKey = `${child.material.uuid}-${isWing}`;

        let mat = sharedClones[cacheKey];

        if (!mat) {
          mat = child.material.clone();

          // --- DOKU AYARLARI ---
          // "Tam metal parlaklığı yerine daha mat ama yansımalı" görünüm
          // Metalik etkiyi kısıyoruz (0'a yaklaştıkça plastik/mat, 1'e yaklaştıkça metal)
          mat.metalness = 0.9;
          // Pürüzlülüğü artırıyoruz (0: ayna gibi yansıtır, 1: hiç yansıtmaz mat olur)
          mat.roughness = 0.1;

          // Çevresel (ışık) yansımaların şiddetini biraz hafifletiyoruz
          if (mat.envMapIntensity !== undefined) {
            mat.envMapIntensity = 0.8;
          }

          // Eğer parça kanatsa ve cam materyaline sahipse cam özelliğini kaldırıp katılaştıralım
          if (isWing && mat.name && mat.name.includes("Glass")) {
            mat.transparent = false;
            mat.opacity = 1;
            mat.transmission = 0; // MeshPhysicalMaterial için şeffaflık
            mat.roughness = 0.5;
            mat.metalness = 0.4;
            mat.color.set("#A0A0A0"); // Tamamen renksiz kalmaması için hafif gri yapalım
          }

          sharedClones[cacheKey] = mat;
        }

        materials[child.uuid] = mat;
      }
    });
    return materials;
  }, [scene]);

  // X-Ray materyali (Holografik / Şeffaf / Wireframe karışımı)
  // MeshBasicMaterial kullanarak ışıklandırma hesaplamalarını devre dışı bırakıyoruz (Performans artışı için)
  const xrayMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#ffb800",
        transparent: true,
        opacity: 0.06, // Arka planda belirgin olması için artırıldı ve renk değiştirildi
        wireframe: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );

  // Referansları sadece model ilk yüklendiğinde bir kez topla
  useLayoutEffect(() => {
    body47Refs.current = [];
    body63Refs.current = [];
    explodeData.current = [];

    scene.traverse((child) => {
      if (child.isMesh && child.name) {
        if (child.name.includes("Component6(Mirror)")) {
          body47Refs.current.push(child);
        } else if (child.name.includes("Component55")) {
          body63Refs.current.push(child);
        }

        // Patlama efekti için başlangıç pozisyonunu ve yönünü hesapla
        if (!child.geometry.boundingBox) {
          child.geometry.computeBoundingBox();
        }
        const center = new THREE.Vector3();
        child.geometry.boundingBox.getCenter(center);

        let dir = center.clone().normalize();
        // Merkezde olan veya yönü belirsiz parçalar için rastgele yön ver
        if (dir.lengthSq() < 0.001) {
          dir
            .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
            .normalize();
        }

        // X ekseninde parçaların daha fazla ayrılması için X yönündeki şiddeti artır
        dir.x *= 2.5;

        explodeData.current.push({
          mesh: child,
          originalPos: child.position.clone(),
          // Parçaları merkezden dışarı doğru oldukça uzağa it. Mesafe ayarlanabilir.
          targetPos: child.position.clone().add(dir.multiplyScalar(60.0)),
        });
      }
    });
  }, [scene]);

  const targetRedParts = ["Component55", "Component48", "ARI SON v2 v6.079"];

  const redMaterials = useMemo(() => {
    const normalizeString = (str) => str.toLowerCase().replace(/[\s_.-]/g, "");

    const materials = {};
    scene.traverse((child) => {
      if (child.isMesh) {
        const isTarget = targetRedParts.some((partName) =>
          normalizeString(child.name).includes(normalizeString(partName)),
        );
        if (isTarget && originalMaterials[child.uuid]) {
          const mat = originalMaterials[child.uuid].clone();
          // Orijinal metalik yüzeyin üzerine hafif kırmızı ton (renk ve parlama)
          mat.color.set("#ff4d4d");
          mat.emissive.set("#330000");

          // Alfasını (saydamlığını) düşürerek daha hafif bir efekt veriyoruz
          mat.transparent = true;
          mat.opacity = 0.5;

          materials[child.uuid] = mat;
        }
      }
    });
    return materials;
  }, [scene, originalMaterials]);

  // Seçilen parçaya göre materyalleri güncelle
  useLayoutEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        if (selectedPart === "subtitle1") {
          child.material = xrayMaterial;
        } else if (selectedPart === "subtitle3" && redMaterials[child.uuid]) {
          child.material = redMaterials[child.uuid];
        } else {
          child.material = originalMaterials[child.uuid];
        }
      }
    });
  }, [selectedPart, scene, originalMaterials, xrayMaterial, redMaterials]);

  // Animasyon döngüsü (Sürekli olarak 60 dereceyi tarar ve simülasyon kaçışlarını yönetir)
  useFrame(({ clock }, delta) => {
    // Performans için bilgi paneli açıkken animasyonu durdur
    if (activePage) return;

    const elapsedTime = clock.getElapsedTime();

    // --- Kanat Çırpma Hızını Kademeli Artırma ---
    const targetWingSpeed =
      selectedPart === "subtitle2" || selectedPart === "subtitle4" ? 45 : 10;
    // Hızı yumuşak bir şekilde (lerp) hedef hıza çekiyoruz
    currentWingSpeed.current = THREE.MathUtils.lerp(
      currentWingSpeed.current,
      targetWingSpeed,
      2 * delta,
    );

    if (selectedPart === "subtitle3") {
      // İleri Malzeme seçildiğinde kanatların tamamen düz (yatay) durmasını sağla
      const TARGET_REST = 0;
      const TWO_PI = Math.PI * 2;
      const k = Math.round((wingPhase.current - TARGET_REST) / TWO_PI);
      const targetPhase = TARGET_REST + k * TWO_PI;

      wingPhase.current = THREE.MathUtils.lerp(
        wingPhase.current,
        targetPhase,
        5 * delta,
      );
    } else {
      // Fazı (phase) güncel hız üzerinden biriktiriyoruz (Zaman atlamalarını önlemek için)
      wingPhase.current += currentWingSpeed.current * delta;
    }

    // Toplam 60 derece (Math.PI / 3) taraması
    const swingAngle = Math.sin(wingPhase.current) * (Math.PI / 6);

    // Yeni modeldeki eksene göre kanat salınımı
    body47Refs.current.forEach((child) => {
      child.rotation.y = swingAngle;
    });

    body63Refs.current.forEach((child) => {
      child.rotation.y = -swingAngle;
    });

    // --- Simülasyon: Kaçınma Animasyonu ---
    if (groupRef.current) {
      if (selectedPart === "subtitle2" || selectedPart === "subtitle4") {
        // Simülasyon veya Yapay Zeka aktif, engellerden kaç
        const dodgeX = useConfigStore.getState().dodgeTargetX;
        const dodgeY = useConfigStore.getState().dodgeTargetY;

        let targetX = 0;
        let targetY = 0;
        let targetRotZ = 0;
        let targetRotX = 0; // İleri doğru eğilme kaldırıldı

        if (dodgeY !== 0) {
          // Yatay engel var, sadece Z ekseni bozulmadan yukarıya doğru yüksel
          targetY = 0.8;
        } else if (dodgeX !== 0) {
          // Dikey engel var, sağa/sola kaç
          targetX = dodgeX > 0.1 ? -0.8 : dodgeX < -0.1 ? 0.8 : 0;
          targetRotZ =
            dodgeX > 0.1 ? Math.PI / 8 : dodgeX < -0.1 ? -Math.PI / 8 : 0;
        }

        // --- Rüzgar Efekti (Hafif Salınım) Kapatıldı ---
        // targetX += Math.sin(elapsedTime * 2.5) * 0.08;
        // targetY += Math.cos(elapsedTime * 2.0) * 0.05;
        // targetRotZ += Math.sin(elapsedTime * 1.5) * 0.03;
        // targetRotX += Math.cos(elapsedTime * 1.8) * 0.03;

        groupRef.current.position.x = THREE.MathUtils.lerp(
          groupRef.current.position.x,
          targetX,
          5 * delta,
        );
        groupRef.current.position.y = THREE.MathUtils.lerp(
          groupRef.current.position.y,
          targetY,
          5 * delta,
        );
        groupRef.current.rotation.z = THREE.MathUtils.lerp(
          groupRef.current.rotation.z,
          targetRotZ,
          5 * delta,
        );
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x,
          targetRotX,
          5 * delta,
        );
      } else {
        // Simülasyon aktif değilse merkeze ve düz konuma dön
        groupRef.current.position.x = THREE.MathUtils.lerp(
          groupRef.current.position.x,
          0,
          5 * delta,
        );
        groupRef.current.position.y = THREE.MathUtils.lerp(
          groupRef.current.position.y,
          0,
          5 * delta,
        );
        groupRef.current.rotation.z = THREE.MathUtils.lerp(
          groupRef.current.rotation.z,
          0,
          5 * delta,
        );
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x,
          0,
          5 * delta,
        );
      }
    }

    // --- Patlama Efekti (Exploded View) ---
    const isExploded = selectedPart === "subtitle3";
    explodeData.current.forEach(({ mesh, originalPos, targetPos }) => {
      const target = isExploded ? targetPos : originalPos;
      // Parçaların pozisyonlarını hedefe doğru yumuşakça hareket ettir
      mesh.position.lerp(target, 5 * delta);
    });
  });

  return (
    <>
      <group ref={groupRef} {...props}>
        <primitive object={scene} />
      </group>
      <PartLabels explodeData={explodeData} selectedPart={selectedPart} />
    </>
  );
}

const PartLabels = ({ explodeData, selectedPart }) => {
  const { t } = useTranslation();

  if (
    selectedPart !== "subtitle3" ||
    !explodeData.current ||
    explodeData.current.length === 0
  ) {
    return null;
  }

  // 1. Etiketlerin Hangi Parçaya Bağlanacağını Belirliyoruz
  // search: Parça isimlerinde aranacak kelimeler (ilk eşleşen alınır)
  // offset: [X, Y, Z] eksenlerinde parçanın merkezinden ne kadar kaydırılacağı
  const configs = [
    {
      text: t("model_labels.energy_wing"),
      search: ["Component6", "wing", "kanat"],
      offset: [1, 0.5, 0],
      direction: "right",
    },
    {
      text: t("model_labels.rf_material"),
      search: ["antenna", "anten", "head", "kafa"],
      offset: [-0.32, 0.15, 0.6],
      direction: "right",
    },
    {
      text: t("model_labels.high_modulus_composite"),
      search: ["joint", "leg", "bacak", "connect", "body"],
      offset: [0.2, 0.19, -0.75],
      direction: "left",
    },
  ];

  const labels = [];

  configs.forEach((config, idx) => {
    let matchedData = null;

    // Tanımlı kelimelere göre parçayı bulmaya çalış
    for (const term of config.search) {
      matchedData = explodeData.current.find((d) =>
        d.mesh.name.toLowerCase().includes(term.toLowerCase()),
      );
      if (matchedData) break;
    }

    // Eğer kelimeyle eşleşen bir parça bulunamazsa, yedek olarak listeden aralıklı bir parça seç
    if (!matchedData) {
      const fallbackIndex = Math.floor(
        (explodeData.current.length / configs.length) * idx,
      );
      matchedData = explodeData.current[fallbackIndex];
    }

    if (matchedData) {
      labels.push({
        mesh: matchedData.mesh,
        text: config.text,
        offset: config.offset,
        direction: config.direction,
      });
    }
  });

  return (
    <group>
      {labels.map((item, i) => (
        <ExplodedLabel
          key={i}
          mesh={item.mesh}
          text={item.text}
          offset={item.offset}
          direction={item.direction}
        />
      ))}
    </group>
  );
};

const ExplodedLabel = ({
  mesh,
  text,
  offset = [0, 0, 0],
  direction = "right",
}) => {
  const ref = useRef();

  useFrame(() => {
    if (mesh && ref.current && ref.current.parent) {
      const vec = new THREE.Vector3();
      // 2. Parçanın dünya üzerindeki gerçek merkez konumunu al
      mesh.getWorldPosition(vec);

      // 3. Konumu grubun kendi eksenine çevir
      ref.current.parent.worldToLocal(vec);

      // 4. Yukarıdaki config'de verdiğiniz [X, Y, Z] ofsetini ekle
      vec.x += offset[0];
      vec.y += offset[1];
      vec.z += offset[2];

      ref.current.position.copy(vec);
    }
  });

  return (
    <group ref={ref}>
      <Html center>
        <div className="relative flex items-center justify-center group transition-opacity duration-500 hover:scale-110">
          {/* Merkez Nokta */}
          <div className="w-2 h-2 bg-[#ffb800] rounded-full shadow-[0_0_10px_#ffb800]"></div>

          {/* Etiket Çizgisi ve Metin */}
          <div
            className={`absolute ${direction === "left" ? "right-1/2 flex-row-reverse" : "left-1/2"} flex items-center`}>
            {/* Noktadan çıkan çizgi */}
            <div
              className={`w-8 h-[1px] bg-gradient-to-r ${direction === "left" ? "from-transparent to-[#ffb800] ml-2" : "from-[#ffb800] to-transparent mr-2"}`}></div>
            <div className="font-display text-[10px] sm:text-xs font-bold tracking-widest text-[#ffb800] bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#ffb800]/30 whitespace-nowrap drop-shadow-[0_0_10px_rgba(255,184,0,0.5)] shadow-[0_0_15px_rgba(0,0,0,0.7)]">
              {text}
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
};

useGLTF.preload("/models/bee_compressed.glb");
