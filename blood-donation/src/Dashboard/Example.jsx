import React, { useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';

const Example = ({ placeholder, value, onChange }) => {
  const editor = useRef(null);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || 'Start typing...',
    }),
    [placeholder]
  );

  return (
    <JoditEditor
      ref={editor}
      value={value}
      config={config}
      tabIndex={1}
      onChange={(newContent) => onChange(newContent)} // 👈 live update
      
    />
  );
};

export default Example;
