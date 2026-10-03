import urllib.request
import json

def test():
    # 1. Message endpoint
    req = urllib.request.Request(
        'http://127.0.0.1:8000/api/analyze/message',
        data=json.dumps({'text': 'Invest 10000 get guaranteed 30000 in 7 days! Limited slots! My OTP is 987654', 'channel': 'WhatsApp'}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    res = json.loads(urllib.request.urlopen(req).read().decode('utf-8'))
    print('Message Analysis:', res['risk_level'], res['risk_score'], 'PII Redacted:', res['pii_report']['detected'])

    # 2. Claim endpoint
    req2 = urllib.request.Request(
        'http://127.0.0.1:8000/api/analyze/claim',
        data=json.dumps({'claim': 'Pay 5000 fee to withdraw 250000 profit'}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    res2 = json.loads(urllib.request.urlopen(req2).read().decode('utf-8'))
    print('Claim Analysis:', res2['status_label_en'], res2['risk_score'])

    # 3. URL endpoint
    req3 = urllib.request.Request(
        'http://127.0.0.1:8000/api/analyze/url',
        data=json.dumps({'url': 'http://sbi-kyc-verify.xyz/login'}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    res3 = json.loads(urllib.request.urlopen(req3).read().decode('utf-8'))
    print('URL Analysis:', res3['risk_level'], res3['risk_score'])

    # 4. Frontend root
    html = urllib.request.urlopen('http://127.0.0.1:8000/').read().decode('utf-8')
    print('Frontend Root loaded successfully, size:', len(html), 'bytes')

if __name__ == '__main__':
    test()
