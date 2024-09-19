import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  requestReview(): Promise<boolean>;
  requestReviewAppGallery(): Promise<boolean>;
  requestReviewGalaxyStore(androidPackageName: string): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("RateApp");
