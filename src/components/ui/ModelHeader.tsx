
type ModelHeaderProps = {
    title: string;
}
function ModelHeader({title}: ModelHeaderProps) {
  return <div className="border-b border-gray-300 pb-3">{title}</div>;
}

export default ModelHeader;