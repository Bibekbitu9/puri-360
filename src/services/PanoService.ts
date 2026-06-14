export class PanoService {
  /**
   * Constructs the URL to open the specific panorama node.
   */
  static getNodeUrl(nodeId: string): string {
    // We assume the Pano2VR output is hosted at this path.
    // In Pano2VR, passing startnode=ID or node=ID in URL hash or query params
    return `/projects/puri_walk_through/index.html#${nodeId}`;
  }

  /**
   * Future implementation: navigate iframe dynamically without reloading
   * using Pano2VR player API via postMessage.
   */
  static navigateIframe(iframeRef: HTMLIFrameElement | null, nodeId: string): void {
    if (iframeRef && iframeRef.contentWindow) {
      // If we had direct API access inside the iframe, we could postMessage:
      // iframeRef.contentWindow.postMessage({ type: 'panoNavigate', nodeId }, '*');
      
      // Fallback: reload the iframe with the new URL
      iframeRef.src = this.getNodeUrl(nodeId);
    }
  }
}
