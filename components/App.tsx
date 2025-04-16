import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Preview, PreviewState } from '@creatomate/preview';
import { useWindowWidth } from '../utility/useWindowWidth';
import JsonEditor from './JsonEditor';

const App: React.FC = () => {
  // React Hook to update the component when the window width changes
  const windowWidth = useWindowWidth();

  // Video aspect ratio that can be calculated once the video is loaded
  const [videoAspectRatio, setVideoAspectRatio] = useState<number>();

  // Reference to the preview
  const previewRef = useRef<Preview>();

  // Current state of the preview
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentState, setCurrentState] = useState<PreviewState>();
  
  // JSON state
  const [jsonData, setJsonData] = useState<any>(defaultJson);

  // This sets up the video player in the provided HTML DIV element
  const setUpPreview = (htmlElement: HTMLDivElement) => {
    if (previewRef.current) {
      previewRef.current.dispose();
      previewRef.current = undefined;
    }

    // Initialize a preview
    const preview = new Preview(htmlElement, 'player', process.env.NEXT_PUBLIC_CREATOMATE_PUBLIC_TOKEN!);

    // Once the SDK is ready, set the initial JSON source
    preview.onReady = async () => {
      try {
        await preview.setSource(jsonData);
        setIsReady(true);
      } catch (error) {
        console.error('Error setting initial JSON source:', error);
      }
    };

    preview.onLoad = () => {
      setIsLoading(true);
    };

    preview.onLoadComplete = () => {
      setIsLoading(false);
    };

    // Listen for state changes of the preview
    preview.onStateChange = (state) => {
      setCurrentState(state);
      setVideoAspectRatio(state.width / state.height);
    };

    previewRef.current = preview;
  };

  // Apply JSON to preview
  const applyJson = async (json: any) => {
    if (previewRef.current && isReady) {
      setIsLoading(true);
      try {
        await previewRef.current.setSource(json);
      } catch (error) {
        console.error('Error applying JSON:', error);
      }
      setIsLoading(false);
    }
  };

  return (
    <Component>
      <Wrapper>
        <Container
          ref={(htmlElement) => {
            if (htmlElement && htmlElement !== previewRef.current?.element) {
              setUpPreview(htmlElement);
            }
          }}
          style={{
            height:
              videoAspectRatio && windowWidth && windowWidth < 768 ? window.innerWidth / videoAspectRatio : undefined,
          }}
        />
      </Wrapper>

      <Panel>
        {isReady && (
          <PanelContent id="panel">
            <JsonEditor 
              jsonData={jsonData} 
              setJsonData={setJsonData} 
              applyJson={() => applyJson(jsonData)}
            />
          </PanelContent>
        )}
      </Panel>

      {isLoading && <LoadIndicator>Loading...</LoadIndicator>}
    </Component>
  );
};

// Default JSON - replace with your own structure
const defaultJson = {
  "format": "mp4",
  "width": 1280,
  "height": 720,
  "elements": [
    {
      "type": "video",
      "source": "https://creatomate-static.s3.amazonaws.com/demo/video1.mp4",
      "duration": 5
    },
    {
      "type": "text",
      "text": "Your Text Here",
      "x": "50%",
      "y": "50%",
      "width": "80%",
      "height": "auto",
      "color": "#ffffff",
      "background_color": "rgba(0, 0, 0, 0.5)",
      "background_padding": "0.5em",
      "font_family": "Roboto",
      "font_size": "5em",
      "font_weight": "bold",
      "text_alignment": "center"
    }
  ]
};

export default App;

const Component = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Wrapper = styled.div`
  display: flex;

  @media (min-width: 768px) {
    flex: 1;
    padding: 2rem;
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  max-width: 720px;
  max-height: 720px;
  margin: auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
`;

const Panel = styled.div`
  flex: 1;
  position: relative;
  background: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);

  @media (min-width: 768px) {
    flex: initial;
    margin: 2rem;
    width: 420px;
    border-radius: 16px;
  }
`;

const PanelContent = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 1.5rem;
  overflow: auto;
`;

const LoadIndicator = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.6rem 1.2rem;
  background: #fff;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-radius: 50px;
  font-size: 15px;
  font-weight: 600;
  color: #4a5568;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:before {
    content: '';
    width: 16px;
    height: 16px;
    border: 2px solid #e2e8f0;
    border-top-color: #4a5568;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (min-width: 768px) {
    top: 50px;
    left: calc((100% - 420px) / 2);
  }
`;
