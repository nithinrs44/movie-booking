import datetime
from rest_framework import status
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from django.contrib.auth.forms import UserCreationForm
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from rest_framework.authtoken.models import Token
from django.http import HttpResponse
from django.contrib.auth import authenticate
from .models import AddMovies
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAdminUser,IsAuthenticated
from django.http import JsonResponse
from .models import Booking
from .serializers import BookingSerializer
from django.contrib.auth import logout
from django.http import HttpRequest
import razorpay
from .serializers import AddMoviesSerializer
from django.db.models import Q



def index(request):
    return HttpResponse("Welcome to my Django project!")


@api_view(['POST'])
@permission_classes((AllowAny,))
def register(request):
    form = UserCreationForm(data=request.data)
    if form.is_valid():
        user = form.save()
        return Response("account created successfully", status=status.HTTP_201_CREATED)
    return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)






@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    if username is None or password is None:
        return Response({'error': 'Please provide both username and password'}, status=status.HTTP_400_BAD_REQUEST)
    
  
    user = authenticate(username=username, password=password)
    
    if not user:
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_404_NOT_FOUND)
    
  
    if user.is_staff:
        role = "admin"
    else:
        role = "user"
    
   
    token, _ = Token.objects.get_or_create(user=user)
    
    return Response({'token': token.key, 'role': role}, status=status.HTTP_200_OK)



@csrf_exempt
@api_view(["POST"])
@permission_classes((IsAuthenticated,))
def logout(request: HttpRequest):
    try:
        
        Token.objects.filter(user=request.user).delete()
        
        
        logout(request._request)
        
        return Response({'success': 'Logged out successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




@api_view(['POST'])
@permission_classes([IsAdminUser,])
def add_movie(request):
    serializer = AddMoviesSerializer(data=request.data)
    if serializer.is_valid():
        movie = serializer.save()
        return Response({'id': movie.id}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




@api_view(['GET'])
@permission_classes([IsAdminUser,])
def list_movies(request):
    movies = AddMovies.objects.all()
    serializer = AddMoviesSerializer(movies, many=True)
    return Response(serializer.data)





@api_view(['PUT'])
@permission_classes([IsAdminUser,])
def update_movie(request, pk):
    movie = get_object_or_404(AddMovies, pk=pk)
    

    serializer = AddMoviesSerializer(movie, data=request.data, partial=True)
    
    
    if serializer.is_valid():
      
        serializer.save()

        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['DELETE'])
@permission_classes([IsAdminUser,])
def delete_movie(request, pk):
    try:
          movies = AddMovies.objects.get(pk=pk)
    except AddMovies.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    movies.delete()
    return Response("deleted successfully")



@api_view(['GET'])
@permission_classes([IsAdminUser,])
def view_movie(request, pk):
    try:
        movie = AddMovies.objects.get(pk=pk)
        serializer = AddMoviesSerializer(movie)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except AddMovies.DoesNotExist:
        return Response("Movie not found", status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
from django.core.cache import cache
from django.http import JsonResponse


#api of disable feature
@api_view(['PUT'])
@permission_classes((IsAdminUser,))
def disable_movie_show(request,pk):
        movie=AddMovies.objects.get(id=pk)
        movie.disabled= not movie.disabled
        movie.save()
        serializer=AddMoviesSerializer(movie)
        return Response(serializer.data,status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated,])
def view(request):
     movies = AddMovies.objects.all()
     serializer = AddMoviesSerializer(movies, many=True)
     return Response(serializer.data)



from datetime import datetime
from django.db.models import Q


@api_view(['GET'])
@permission_classes([IsAuthenticated,])
def search(request, query_date):
    try:
        # Convert date string to datetime object
        search_date = datetime.strptime(query_date, '%Y-%m-%d').date()
        movies = AddMovies.objects.filter(Q(start_date__lte=search_date) & Q(end_date__gte=search_date))
        serializer = AddMoviesSerializer(movies, many=True)
        return Response(serializer.data)
    except ValueError:
        # Handle case when the query is not a valid date
        movies = AddMovies.objects.filter(title__istartswith=query_date)
        serializer = AddMoviesSerializer(movies, many=True)
        return Response(serializer.data)








# Initialize Razorpay client
razorpay_client = razorpay.Client(auth=("rzp_test_JRq2o3chfPfzcG", "Mu05HrZZQEUFbYXHGVrNHM2s"))


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def book_ticket(request):
    
    serializer = BookingSerializer(data=request.data, context={'request': request})

    if serializer.is_valid():
        booking_instance = serializer.save()
        booking_id = booking_instance.id
        return Response({'message': 'Booking successful', 'booking_id': booking_id}, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=400)



@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated,])
def initiate_payment(request):
    if request.method == "POST":
        amount = request.data.get("amount")
        if amount is None or not isinstance(amount, (int, float)):
            return JsonResponse({'error': 'Invalid amount'}, status=400)

        amount_in_paise = int(amount * 250)  

        try:
            order_response = razorpay_client.order.create({'amount': amount_in_paise, 'currency': 'INR'})
            return JsonResponse(order_response)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated,])
def handle_payment(request):
    if request.method == "POST":
        # Extract payment details from request
        data = request.data
       
        razorpay_payment_id = data.get('razorpay_payment_id')
        if razorpay_payment_id:
            return JsonResponse({'status': 'success'})
        else:
            # Payment failed
            return JsonResponse({'status': 'failure', 'error': 'razorpay_payment_id missing'}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)




@api_view(['GET'])
@permission_classes([IsAuthenticated,])
def my_bookings(request):
    if not request.user.is_authenticated:
        return Response({'error': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)

    user_bookings = Booking.objects.filter(user=request.user)
    serializer = BookingSerializer(user_bookings, many=True)
    return Response(serializer.data)


from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.mail import send_mail

csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated,])
def send_email(request,pk):
     movies = Booking.objects.get(pk=pk)
     subject="Booking Confirmation"
     from_email = "admin@gmail.com"
     recipient_list = ["your_mailtrap_inbox@mailtrap.io"]
     html_message = render_to_string('email.html', {'booking': movies})
     plain_message = strip_tags(html_message)
     send_mail(subject, plain_message, from_email, recipient_list, html_message=html_message)
     return HttpResponse('Email sent successfully')

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import AddMovies



def get_showtimes_for_movie(request, movie_id):
   
    movie = get_object_or_404(AddMovies, pk=movie_id)

    showtimes = movie.showTimes

    
    return JsonResponse({'showtimes': showtimes})