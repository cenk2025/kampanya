import EditorWorkspace from '@/components/editor/EditorWorkspace';

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <div className="absolute inset-0 bg-black z-50">
      <EditorWorkspace id={id} />
    </div>
  );
}
