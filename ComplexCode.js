/*
Filename: ComplexCode.js
Description: This code implements a complex algorithm to solve the Traveling Salesman Problem using a genetic algorithm approach.
*/

// Create a graph representing the cities and distances between them
const cities = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const distances = [
  [0, 2, 3, 1, 4, 7, 5],
  [2, 0, 6, 3, 1, 2, 3],
  [3, 6, 0, 2, 3, 5, 2],
  [1, 3, 2, 0, 2, 4, 1],
  [4, 1, 3, 2, 0, 3, 2],
  [7, 2, 5, 4, 3, 0, 6],
  [5, 3, 2, 1, 2, 6, 0],
];

// Generate a random initial population
function generateInitialPopulation(populationSize) {
  const population = [];
  
  for (let i = 0; i < populationSize; i++) {
    const individual = cities.slice();
    shuffleArray(individual);
    population.push(individual);
  }
  
  return population;
}

// Shuffle array elements using Fisher-Yates algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Calculate the total distance for a given path
function calculateTotalDistance(path) {
  let totalDistance = 0;
  
  for (let i = 0; i < path.length - 1; i++) {
    const currentCity = cities.indexOf(path[i]);
    const nextCity = cities.indexOf(path[i + 1]);
    totalDistance += distances[currentCity][nextCity];
  }
  
  return totalDistance;
}

// Perform selection using tournament selection strategy
function selection(population, selectionSize) {
  const selectedIndividuals = [];
  
  for (let i = 0; i < selectionSize; i++) {
    const tournamentIndividuals = [];
    
    for (let j = 0; j < 5; j++) {
      const randomIndex = Math.floor(Math.random() * population.length);
      tournamentIndividuals.push(population[randomIndex]);
    }
    
    tournamentIndividuals.sort((a, b) => calculateTotalDistance(a) - calculateTotalDistance(b));
    selectedIndividuals.push(tournamentIndividuals[0]);
  }
  
  return selectedIndividuals;
}

// Perform crossover using ordered crossover strategy
function crossover(parent1, parent2) {
  const child = [];
  const pivot = Math.floor(Math.random() * parent1.length);
  
  for (let i = 0; i < parent1.length; i++) {
    if (i <= pivot) {
      child.push(parent1[i]);
    } else {
      if (!child.includes(parent2[i])) {
        child.push(parent2[i]);
      }
    }
  }
  
  return child;
}

// Perform mutation using swap mutation strategy
function mutation(individual) {
  const mutatedIndividual = individual.slice();
  const index1 = Math.floor(Math.random() * individual.length);
  let index2 = Math.floor(Math.random() * individual.length);
  
  while (index1 === index2) {
    index2 = Math.floor(Math.random() * individual.length);
  }
  
  [mutatedIndividual[index1], mutatedIndividual[index2]] = [mutatedIndividual[index2], mutatedIndividual[index1]];
  
  return mutatedIndividual;
}

// Evolve the population using genetic algorithm
function geneticAlgorithm(populationSize, generations) {
  let population = generateInitialPopulation(populationSize);
  
  for (let generation = 0; generation < generations; generation++) {
    const selectedParents = selection(population, Math.floor(populationSize / 2));
    const offsprings = [];
    
    for (let i = 0; i < selectedParents.length; i += 2) {
      const parent1 = selectedParents[i];
      const parent2 = selectedParents[i + 1];
      const child = crossover(parent1, parent2);
      offsprings.push(mutation(child));
    }
    
    population = [...selectedParents, ...offsprings];
  }
  
  population.sort((a, b) => calculateTotalDistance(a) - calculateTotalDistance(b));
  return population[0];
}

// Usage example
const optimalPath = geneticAlgorithm(100, 1000);
console.log('Optimal Path:', optimalPath);
console.log('Total Distance:', calculateTotalDistance(optimalPath));