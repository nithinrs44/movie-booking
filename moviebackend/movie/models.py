from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator

class AddMovies(models.Model):
    title = models.CharField(max_length=50)
    about = models.TextField()
    category = models.CharField(max_length=50)
    start_date = models.DateField()
    end_date = models.DateField()
    showTimes=models.JSONField(max_length=50)
    poster_url = models.URLField(max_length=1000)
    disabled=models.BooleanField(default=False)
  

    def __str__(self):
        return self.title
    
class Booking(models.Model):
  
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    movie = models.ForeignKey(AddMovies, on_delete=models.CASCADE)
    booking_date = models.DateField()
    show_time = models.CharField(max_length=40)
    number_of_tickets = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    ticket_price = models.DecimalField(max_digits=10, decimal_places=2, default=250)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    def __str__(self):
        return f"{self.user.username} - {self.movie.title} - {self.show_time} - {self.booking_date}"

    def calculate_total_price(self):
        return self.number_of_tickets * self.ticket_price




