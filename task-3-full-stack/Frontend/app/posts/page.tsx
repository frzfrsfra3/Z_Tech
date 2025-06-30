// app/posts/page.tsx
import { Suspense } from 'react';
import ArticlesPageContent from './ArticlesPageContent';

export default function ArticlesPage() {
  return (
    <Suspense fallback={<div>Loading articles...</div>}>
      <ArticlesPageContent />
    </Suspense>
  );
}
