/* Адаптивність для різних пристроїв */
    @media (max-width: 1200px) {
      .courses-container {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      }
    }
    
    @media (max-width: 768px) {
      .courses-container {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      }
      
      .course-card {
        padding: 1rem;
      }
    }
    
    @media (max-width: 480px) {
      .courses-container {
        grid-template-columns: 1fr;
      }
      
      .card-buttons {
        flex-direction: row;
      }
      
      .card-buttons button {
        width: auto;
      }
    }
