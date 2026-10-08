import React, { useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { MobileWalletProvider, createSolanaDevnet, useMobileWallet } from '@wallet-ui/react-native-kit';
import { address, createNoopSigner } from '@solana/kit';
import { getTransferSolInstruction } from '@solana-program/system';

const cluster = createSolanaDevnet({ url: 'https://api.devnet.solana.com' });
function Payments() {
  const { account, connect, disconnect, sendTransactions, client } = useMobileWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('0.001');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('Connect an Android wallet to get started.');
  const [signature, setSignature] = useState('');
  const run = async (action: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    try { await action(); } catch (error) { setStatus(error instanceof Error ? error.message : 'Wallet request failed.'); }
    finally { setBusy(false); }
  };
  const prepare = () => {
    if (!account) return;
    try {
      const destination = address(recipient.trim());
      if (!/^\d+(\.\d{1,9})?$/.test(amount)) throw new Error('Enter a positive SOL amount with at most nine decimal places.');
      const [whole, fraction = ''] = amount.split('.');
      const lamports = BigInt(whole) * 1000000000n + BigInt(fraction.padEnd(9, '0'));
      if (lamports <= 0n || lamports > 100000000n) throw new Error('Devnet transfers must be between 0 and 0.1 SOL.');
      Alert.alert('Confirm devnet transfer', `${amount} test SOL to ${destination}. No fiat payout will occur.`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Review in wallet', onPress: () => void run(async () => {
          setSignature('');
          const result = await sendTransactions([getTransferSolInstruction({ source: createNoopSigner(account.address), destination, amount: lamports })]);
          setSignature(String(result));
          setStatus('Submitted to devnet. Open the explorer to verify confirmation.');
        }) },
      ]);
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Invalid transfer.'); }
  };
  return <ScrollView contentContainerStyle={s.page}>
    <Text style={s.tag}>RAVASEND · SOLANA MOBILE</Text>
    <Text style={s.title}>Move value.\nKeep control.</Text>
    <Text style={s.notice}>DEVNET PROTOTYPE — test SOL only. This separate app does not connect to Ravasend customer balances or fiat payouts.</Text>
    <Pressable disabled={busy} style={s.button} onPress={() => void run(async () => {
      if (account) { await disconnect(); setStatus('Disconnected.'); } else { await connect(); setStatus('Wallet connected.'); }
    })}><Text style={s.buttonText}>{account ? 'Disconnect wallet' : 'Connect mobile wallet'}</Text></Pressable>
    {account && <><Text selectable style={s.label}>{account.address}</Text>
      <Pressable disabled={busy} onPress={() => void run(async () => {
        const balance = await client.rpc.getBalance(account.address).send();
        setStatus(`Devnet balance: ${Number(balance.value) / 1e9} SOL`);
      })}><Text style={s.link}>Check on-chain balance</Text></Pressable></>}
    <Text style={s.label}>Recipient Solana address</Text>
    <TextInput value={recipient} onChangeText={setRecipient} autoCapitalize="none" autoCorrect={false} style={s.input} placeholder="Devnet wallet address" placeholderTextColor="#8e9bb2" />
    <Text style={s.label}>Test SOL amount · maximum 0.1</Text>
    <TextInput value={amount} onChangeText={setAmount} keyboardType="decimal-pad" style={s.input} />
    <Pressable disabled={busy || !account} style={[s.button, (!account || busy) && {opacity:0.4}]} onPress={prepare}><Text style={s.buttonText}>{busy ? 'Working…' : 'Review devnet payment'}</Text></Pressable>
    <Text accessibilityLiveRegion="polite" style={s.label}>{status}</Text>
    {!!signature && <Pressable onPress={() => void Linking.openURL(`https://explorer.solana.com/tx/${encodeURIComponent(signature)}?cluster=devnet`)}><Text style={s.link}>Verify transaction on Solana Explorer ↗</Text></Pressable>}
  </ScrollView>;
}
export default function App() {
  return <MobileWalletProvider cluster={cluster} identity={{name:'Ravasend Devnet',uri:'https://ravasend.com'}}><Payments /></MobileWalletProvider>;
}
const s = StyleSheet.create({page:{flexGrow:1,backgroundColor:'#091322',padding:26,paddingTop:64,gap:18},tag:{color:'#64e8ba',fontWeight:'700',letterSpacing:2},title:{color:'#fff',fontSize:42,fontWeight:'800'},notice:{color:'#b4c3d6',lineHeight:22},label:{color:'#d6dfed',lineHeight:21},input:{backgroundColor:'#18263b',color:'#fff',padding:16,borderRadius:12},button:{backgroundColor:'#64e8ba',padding:18,borderRadius:14,alignItems:'center'},buttonText:{color:'#091322',fontWeight:'700'},link:{color:'#64e8ba',lineHeight:24}});
