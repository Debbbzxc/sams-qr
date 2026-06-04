const fs = require('fs');
const path = require('path');

const hooksDir = path.join(__dirname, 'hooks');
const filePath = path.join(hooksDir, 'useManilaNow.js');

const content = `import { useState, useEffect } from 'react';

const MANILA_TIMEZONE = 'Asia/Manila';

const formatManilaDateTime = () => {
  const formatter = new Intl.DateTimeFormat('en-PH', {
    timeZone: MANILA_TIMEZONE,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return formatter.format(new Date());
};

export const useManilaNow = () => {
  const [now, setNow] = useState(() => formatManilaDateTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(formatManilaDateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return now;
};`;

try {
  fs.mkdirSync(hooksDir, { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log('✓ Directory created: ' + hooksDir);
  console.log('✓ File created: ' + filePath);
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
