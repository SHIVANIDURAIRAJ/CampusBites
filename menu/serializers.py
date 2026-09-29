from rest_framework import serializers
from .models import Food, Order


class FoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Food
        fields = ['id', 'name', 'category', 'price', 'description']


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            'id',
            'customer_name',
            'food',
            'quantity',
            'total_price',
            'status',
            'created_at'
        ]