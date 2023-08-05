const Course = ({ course }) => {
    return (
      <div>
        <Header course={course.name} />
        {course.parts.map(part => 
          <Part key={part.id} part={part} />
        )}
        <Total sum={course.parts.reduce((acc, curr) => (acc + curr.exercises), 0)} />
      </div>
    )
  }
  
  const Header = ({ course }) => <h2>{course}</h2>
  
  const Total = ({ sum }) => <p><b>total of {sum} exercises</b></p>
  
  const Part = ({ part }) => 
    <p>
      {part.name} {part.exercises}
    </p>

export default Course