# class_professors = {'Cart_253_A':'Pippin Bar',
#                     'Cart_211':'Brad Todd',
#                     'Cart_214':'Joanna Berzowska', 
#                     'Cart_215':'Jonathan Lessard'}
# # print(type(class_professors))
# specialList = {17: [1.6, 2.45], 42: [11.6, 19.4], 101: [0.123, 4.89]}
# # print(type(specialList[17]))
# # print(class_professors['Cart_253_A'])

# # print(specialList.keys())
# # for key in specialList.keys():
# #     print(specialList[key]) #printing the values associated with every key

# # print(specialList.values())
# # for value in specialList.values():
# #     print(value)

# # print(specialList.items())
# # for item in specialList.items():
# #     print(item[0])

shopping_rev = {
            'vegetables': [{'spinach':["green","blue"]}, 'carrots','broccoli','lettuce'],
            'fruit': ['canteloupe', 'banananas'],
             'bakery': ['bagels', 'rye bread'],
            }
shopping_rev["cleaning_items"] = ["dish soap", "sponges"]
shopping_rev['cleaning_items'].append("bleach")
print(shopping_rev["cleaning_items"])