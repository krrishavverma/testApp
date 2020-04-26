n = 5
i = 0
s = 0
t = 1
print(s,t,end=" ")

while i < (n-2):
    f = s + t
    print(f,"",end="")
    s = t
    t = f
    i = i + 1