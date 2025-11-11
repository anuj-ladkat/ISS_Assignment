
const TagCloud = ({ tags }) => {
  const colors = ['#e3f2fd', '#f3e5f5', '#e8f5e9', '#fff3e0', '#fce4ec'];

  return (
    <div className="tag-cloud">
      <h3>Key Topics</h3>
      <div className="tags-container">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="tag"
            style={{ backgroundColor: colors[index % colors.length] }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagCloud;
