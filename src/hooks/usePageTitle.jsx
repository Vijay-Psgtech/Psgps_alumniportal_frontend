import React, { useEffect } from 'react'

const usePageTitle = (title) => {
  useEffect(() => {
    document.title = `${title} | PSG Public Schools Alumni Association`;
  }, [title]);
};

export default usePageTitle