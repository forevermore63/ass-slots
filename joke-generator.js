const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function getRandomJoke() {
  try {
    const response = await fetch('https://api.api-ninjas.com/v1/jokes?limit=1');
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return data[0].joke;
    } else {
      return 'No joke found!';
    }
  } catch (error) {
    console.error('Error fetching joke:', error);
    return 'Failed to fetch a joke. Please try again later.';
  }
}

async function main() {
  console.log('🎭 Random Joke Generator\n');
  
  for (let i = 0; i < 3; i++) {
    const joke = await getRandomJoke();
    console.log(`Joke ${i + 1}: ${joke}\n`);
  }
}

main();
