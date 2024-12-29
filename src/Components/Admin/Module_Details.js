import React from 'react'

function Module_Details({courses}) {
  return (
    <div>
      <div>
        
      {
    Array.isArray(courses) && courses.map((item, index) => (
        <div key={index}>
            <p>{item.topic_title}</p>
            {/* Add additional fields here if needed */}
        </div>
    ))
}
        
      </div>
    </div>
  );
}

export default Module_Details