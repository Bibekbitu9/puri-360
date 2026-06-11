import type { PanoramaNode } from '../types/gis';
import panoramaData from '../data/panoramaNodes.json';

export class MetadataService {
  /**
   * Fetches the panorama metadata.
   * Currently uses local JSON, but abstracted to support API calls later.
   */
  static async getPanoramas(): Promise<PanoramaNode[]> {
    // In a real application, you might fetch this from an endpoint
    // return fetch('/api/panoramas').then(res => res.json());
    
    return new Promise((resolve) => {
      // Simulate network delay if desired, or resolve immediately
      resolve(panoramaData as PanoramaNode[]);
    });
  }
}
