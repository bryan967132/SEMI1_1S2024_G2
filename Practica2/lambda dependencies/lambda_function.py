from MySQL import MySQL

bd = MySQL()

def validate(intent, slots):
    if not slots['Usuario']:
            return {
                'isValid': False,
                'violatedSlot': 'Usuario',
            }

    if intent == 'SearchPhoto':
        if not slots['Cantidad']:
            return {
                'isValid': False,
                'violatedSlot': 'Cantidad',
            }
            
        if not slots['Album']:
            return {
                'isValid': False,
                'violatedSlot': 'Album'
            }
            
        if not slots['Orden']:
            return {
                'isValid': False,
                'violatedSlot': 'Orden'
            }
    
    if intent == 'TranslateDescription':
        if not slots['Album']:
            return {
                'isValid': False,
                'violatedSlot': 'Album'
            }

        if not slots['Foto']:
            return {
                'isValid': False,
                'violatedSlot': 'Foto',
            }

        if not slots['Idioma']:
            return {
                'isValid': False,
                'violatedSlot': 'Idioma'
            }

    if intent == 'CreateAlbum':
        if not slots['Album']:
            return {
                'isValid': False,
                'violatedSlot': 'Album'
            }

    return {'isValid': True}

def routeQuery(intent, slots):
    global bd
    if intent == 'SearchPhoto':
        return bd.searchPhoto(
            slots['Usuario']['value']['originalValue'],
            slots['Album']['value']['originalValue'],
            slots['Orden']['value']['originalValue'],
            slots['Cantidad']['value']['originalValue']
        )
    if intent == 'CreateAlbum':
        return bd.createAlbum(
            slots['Usuario']['value']['originalValue'],
            slots['Album']['value']['originalValue']
        )
    return []

def lambda_handler(event, context):
    global bd
    slots = event['sessionState']['intent']['slots']
    intent = event['sessionState']['intent']['name']
    validation_result = validate(intent, slots)
    
    if event['invocationSource'] == 'DialogCodeHook':
        if not validation_result['isValid']:
            response = {
                'sessionState': {
                    'dialogAction': {
                        'slotToElicit': validation_result['violatedSlot'],
                        'type': 'ElicitSlot'
                    },
                    'intent': {
                        'name': intent,
                        'slots': slots
                    }
                }
            }
            if validation_result['violatedSlot'] == 'Album':
                response['messages'] = [{
                    "contentType": "PlainText",
                    "content": "¿De qué album?"
                }] + bd.getAlbums(slots['Usuario']['value']['originalValue'])
                if intent == 'CreateAlbum':
                    response['messages'][0]['content'] = '¿Cómo quieres llamar al nuevo album?'
                    response['messages'][1]['content'] = '¡Nómbralo distinto a los que ya tienes!\n' + response['messages'][1]['content']

            if validation_result['violatedSlot'] == 'Foto':
                response['messages'] = [{
                    "contentType": "PlainText",
                    "content": "¿Qué fotografía?"
                }] + bd.getPhotosDescriptions(slots['Usuario']['value']['originalValue'], slots['Album']['value']['originalValue'])

            if validation_result['violatedSlot'] == 'Idioma':
                response['messages'] = [
                    {
                        "contentType": "PlainText",
                        "content": '''Elige un idioma:
1. Francés
2. Alemán
3. Italiano
4. Bosnio
5. Turco
6. Sueco
7. Ruso'''
                    }
                ]
            return response
        else:
            response = {
                'sessionState': {
                    'dialogAction': {
                        'type': 'Delegate'
                    },
                    'intent': {
                        'name': intent,
                        'slots': slots
                    }
                }
            }
    if event['invocationSource'] == 'FulfillmentCodeHook':
        responseQuery = routeQuery(intent, slots)
        response = {
            "sessionState": {
                "dialogAction": {
                    "type": "Close"
                },
                "intent": {
                    'name':intent,
                    'slots': slots,
                    'state':'Fulfilled'
                }
            },
            "messages": responseQuery + [
                {
                    "contentType": "PlainText",
                    "content": "¡Fue un placer haberte ayudado!"
                }
            ]
        }
    return response