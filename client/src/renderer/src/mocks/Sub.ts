const loadSubjects = async () => {
  const subjects = await window.context.getSubjects()
  return subjects
}

export loadSubjects