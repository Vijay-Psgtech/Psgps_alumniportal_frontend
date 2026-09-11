import React, { useEffect } from 'react'

const usePageTitle = (title) => {
  useEffect(() => {
    document.title = `${title} | PSG ARTS ALUMNI ASSOCIATION`;
  }, [title]);
};

export default usePageTitle