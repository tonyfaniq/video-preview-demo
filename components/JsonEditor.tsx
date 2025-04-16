import React, { useState } from 'react';
import styled from 'styled-components';

interface JsonEditorProps {
  jsonData: any;
  setJsonData: (data: any) => void;
  applyJson: () => void;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ jsonData, setJsonData, applyJson }) => {
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonString, setJsonString] = useState<string>(JSON.stringify(jsonData, null, 2));

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonString(value);
    
    try {
      const parsed = JSON.parse(value);
      setJsonData(parsed);
      setJsonError(null);
    } catch (error) {
      setJsonError('Invalid JSON format');
    }
  };

  const handleApply = () => {
    if (!jsonError) {
      applyJson();
    }
  };

  return (
    <EditorContainer>
      <EditorHeader>
        <h2>JSON Editor</h2>
        <p>Edit your video configuration in JSON format</p>
      </EditorHeader>
      
      <EditorTextarea 
        value={jsonString}
        onChange={handleJsonChange}
        placeholder="Enter your JSON here..."
        hasError={!!jsonError}
      />
      
      {jsonError && <ErrorMessage>{jsonError}</ErrorMessage>}
      
      <ButtonGroup>
        <Button onClick={handleApply} disabled={!!jsonError}>
          Apply JSON
        </Button>
        <Button 
          className="secondary"
          onClick={() => {
            try {
              const formatted = JSON.stringify(JSON.parse(jsonString), null, 2);
              setJsonString(formatted);
            } catch (error) {
              // Do nothing if JSON is invalid
            }
          }}
          disabled={!!jsonError}
        >
          Format JSON
        </Button>
      </ButtonGroup>
      
      <TemplateGuide>
        <h3>JSON Structure Guide</h3>
        <p>Your JSON should include:</p>
        <ul>
          <li><strong>format</strong>: Output format (mp4, gif, etc.)</li>
          <li><strong>width/height</strong>: Dimensions in pixels</li>
          <li><strong>elements</strong>: Array of video elements (text, video, image, etc.)</li>
        </ul>
        <p>Each element requires specific properties based on its type.</p>
      </TemplateGuide>
    </EditorContainer>
  );
};

export default JsonEditor;

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const EditorHeader = styled.div`
  margin-bottom: 1rem;
  
  h2 {
    margin: 0 0 0.5rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-color);
  }
  
  p {
    margin: 0;
    color: var(--text-light);
    font-size: 0.9rem;
  }
`;

const EditorTextarea = styled.textarea<{ hasError: boolean }>`
  flex: 1;
  min-height: 300px;
  padding: 1rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  background-color: var(--input-bg);
  border: 1px solid ${props => props.hasError ? '#e53e3e' : 'var(--border-color)'};
  border-radius: var(--radius-sm);
  resize: none;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#e53e3e' : 'var(--primary-color)'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(229, 62, 62, 0.15)' : 'rgba(67, 97, 238, 0.15)'};
  }
`;

const ErrorMessage = styled.div`
  margin-top: 0.5rem;
  color: #e53e3e;
  font-size: 0.9rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  flex: 1;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TemplateGuide = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  
  h3 {
    margin: 0 0 0.75rem;
    font-size: 1.1rem;
    font-weight: 600;
  }
  
  p {
    margin: 0 0 0.75rem;
    font-size: 0.9rem;
    color: var(--text-light);
  }
  
  ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
    font-size: 0.9rem;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
`; 