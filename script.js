// Make entire card clickable
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    const target = card.getAttribute('data-link');
    if (target) {
      window.location.href = target;
    }
  });
});

// Also handle button clicks
document.querySelectorAll('.explore-btn').forEach(button => {
  button.addEventListener('click', e => {
    e.stopPropagation(); // Prevent double navigation
    const parentCard = button.closest('.card');
    const target = parentCard.getAttribute('data-link');
    if (target) {
      window.location.href = target;
    }
  });
});
