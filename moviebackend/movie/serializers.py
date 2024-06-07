# serializers.py
from rest_framework import serializers
from .models import AddMovies
from .models import Booking

class AddMoviesSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddMovies
        fields = '__all__'



class BookingSerializer(serializers.ModelSerializer):
    total_price = serializers.SerializerMethodField()
    movie_details = AddMoviesSerializer(source='movie', read_only=True)  

    class Meta:
        model = Booking
        fields = ['id', 'movie', 'movie_details', 'booking_date', 'show_time', 'number_of_tickets', 'ticket_price', 'total_price']  
        read_only_fields = ['total_price', 'movie_details'] 

    def get_total_price(self, obj):
        return obj.calculate_total_price()

    def create(self, validated_data):
        user = self.context['request'].user
        
      
        ticket_price = 250.00 
        
       
        number_of_tickets = validated_data.get('number_of_tickets', 0)
        total_price = ticket_price * number_of_tickets

        booking = Booking.objects.create(
            user=user,
            ticket_price=ticket_price,
            total_price=total_price,
            **validated_data
        )
        
        return booking




