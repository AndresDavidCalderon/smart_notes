import { useEffect, useState } from 'react';

function Caret() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => {
      setHidden(!hidden);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  });
  return <span hidden={hidden}>|</span>;
}

export default Caret;
