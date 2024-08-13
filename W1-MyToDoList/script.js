document.getElementById('myForm').addEventListener('submit', (event) => {
  event.preventDefault();
  let input = document.getElementById("newTask").value;
  console.log("Input: " + input);
});