import { Movie } from "@/models/Movie";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { FC, useState } from "react";
import * as web3 from "@solana/web3.js"
import { Box, Button, Center, FormControl, FormLabel, Input, Link, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Switch, Textarea } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { getCount, setCount } from "@/redux/transactionSlice";
import { PROGRAM_ID, explorer_url } from "@/constants/web3";

export const Form: FC = () => {
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(0)
  const [description, setDescription] = useState("")
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [toggle, setToggle] = useState(true)
  const transactionCount = useSelector(getCount);
  const [trSig, setTrSig] = useState('')
  const dispatch = useDispatch();

  const handleTransactionSubmit = async (movie: Movie) => {
    if (!publicKey) {
      alert("Please connect of your wallet!")
      return
    }

    const buffer = movie.serialize(toggle ? 0 : 1);
    const transaction = new web3.Transaction()

    const [pda] = await web3.PublicKey.findProgramAddress(
      [publicKey.toBuffer(), new TextEncoder().encode(movie.title)],
      new web3.PublicKey(PROGRAM_ID)
    )

    const instruction = new web3.TransactionInstruction({
      keys: [
        {
          pubkey: publicKey,
          isSigner: true,
          isWritable: false,
        },
        {
          pubkey: pda,
          isSigner: false,
          isWritable: true
        },
        {
          pubkey: web3.SystemProgram.programId,
          isSigner: false,
          isWritable: false
        }
      ],
      data: buffer,
      programId: new web3.PublicKey(PROGRAM_ID)
    })

    transaction.add(instruction)

    try {
      const txid = await sendTransaction(transaction, connection)
      console.log(`Transaction submitted: ${explorer_url(txid)}`)
      setTrSig(txid);
      const lastBlock = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        blockhash: lastBlock.blockhash,
        lastValidBlockHeight: lastBlock.lastValidBlockHeight,
        signature: txid,
      })
      dispatch(setCount(transactionCount + 1))
    } catch (e) {
      alert(JSON.stringify(e))
    }
  }

  const handleSubmit = (event: any) => {
    event.preventDefault()
    setTrSig('');
    const movie = new Movie(title, rating, description);
    handleTransactionSubmit(movie)
  }

  return (
    <Box
      p={4}
      display={{ md: "flex" }}
      maxWidth="32rem"
      borderWidth={1}
      margin={2}
      justifyContent="center"
    >
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel color="gray.200">
            Movie Title
          </FormLabel>
          <Input
            id="title"
            color="gray.400"
            onChange={event => setTitle(event.currentTarget.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel color="gray.200">
            Add your review
          </FormLabel>
          <Textarea
            id='review'
            color='gray.400'
            onChange={event => setDescription(event.currentTarget.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel color="gray.200">Rating</FormLabel>
          <NumberInput
            max={5}
            min={1}
            onChange={(valueString) => setRating(parseInt(valueString))}
          >
            <NumberInputField id='amount' color='gray.400' />
            <NumberInputStepper color="gray.400">
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl display="center" alignItems="center">
          <FormLabel color="gray.100" mt={2}>
            Update
          </FormLabel>
          <Switch
            id="update"
            onChange={(event) => setToggle((prevCheck) => !prevCheck)}
          />
        </FormControl>
        <Button width="full" mt={4} type="submit">
          Submit Review
        </Button>
        {
          trSig !== ''
            ?
            <Center color="green.200" mt={2}>
              <Link href={explorer_url(trSig)} target="_blank">
                Check your transaction on Explorer
              </Link>
            </Center>
            : null
        }
      </form>
    </Box>
  )
}