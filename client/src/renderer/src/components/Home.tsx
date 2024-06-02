import { Container, Stack } from '@mui/material'
import CardLayout from './layout/CardLayout'

function Home(): JSX.Element {
  const subject = ['BCA', 'BBA', 'BA', 'BCOM']
  return (
    <>
      <Container maxWidth="lg">
        <Stack gap={2} direction="row" flexWrap="wrap">
          {subject.map((text) => (
            <CardLayout key={text} value={{ name: text }} />
          ))}
        </Stack>
      </Container>
    </>
  )
}

export default Home
