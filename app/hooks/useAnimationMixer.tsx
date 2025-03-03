import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useActiveComponent } from "../providers/ActiveComponentProvider";

interface UseAnimationMixerProps {
  modelRef: React.RefObject<THREE.Group>;
  animations: THREE.AnimationClip[];
  isActive: boolean;
}

export const useAnimationMixer = ({ modelRef, animations, isActive }: UseAnimationMixerProps) => {
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionsRef = useRef<THREE.AnimationAction[]>([]);
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
  const { setShowComponentDetails } = useActiveComponent();

  useEffect(() => {
    if (!animations.length || !modelRef.current) return;

    mixerRef.current = new THREE.AnimationMixer(modelRef.current);
    actionsRef.current = animations.map((clip) => {
      const action = mixerRef.current!.clipAction(clip);
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      return action;
    });

    return () => {
      mixerRef.current?.stopAllAction();
      actionsRef.current.forEach((action) => action.stop());
    };
  }, [animations, modelRef]);

  useEffect(() => {
    if (isActive) {
      actionsRef.current.forEach((action) => {
        action.reset();
        action.play();
        action.getMixer().addEventListener("finished", () => {
          setIsAnimationPlaying(false);
          setShowComponentDetails(true);
        });
      });
      setIsAnimationPlaying(true);
      setShowComponentDetails(false);
    } else {
      actionsRef.current.forEach((action) => action.stop());
      setIsAnimationPlaying(false);
      setShowComponentDetails(false);
    }
  }, [isActive]);

  return { mixer: mixerRef, isAnimationPlaying };
};
