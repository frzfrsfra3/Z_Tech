import { redirect } from 'next/navigation';
import React from 'react';

const Content: React.FC = () => {
  return (
    <div>
     {redirect('/posts')}
    </div>
  );
};
export default Content;